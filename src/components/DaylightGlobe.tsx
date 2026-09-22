/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import * as THREE from 'three';

// Dynamic import with no SSR to avoid window is not defined errors
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function DaylightGlobe({ simulatedDate }: { simulatedDate?: Date | null }) {
  const [mounted, setMounted] = useState(false);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate the globe slowly
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.pointOfView({ altitude: 2 });
    }
  }, [mounted]);

  // Calculate sun position to simulate daylight/terminator line
  const activeDate = simulatedDate || new Date();
  const sunPos = getSunPosition(activeDate);

  // Update light position when time changes
  useEffect(() => {
    if (globeRef.current && globeRef.current.scene) {
      const scene = globeRef.current.scene();
      const sunLight = scene.getObjectByName("sunLight");
      const sunMesh = scene.getObjectByName("sunMesh");
      
      const coords = latLngToVector3(sunPos.lat, sunPos.lng, 2.5); // distance 2.5x globe radius, within camera range
      if (sunLight) {
        sunLight.position.copy(coords);
      }
      if (sunMesh) {
        sunMesh.position.copy(coords);
      }
    }
  }, [sunPos.lat, sunPos.lng]);

  if (!mounted) {
    return <div className="w-full h-full min-h-[500px] flex items-center justify-center text-gray-500 font-mono text-sm">Initializing Universal View...</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center cursor-move mix-blend-screen">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        showAtmosphere={true}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.15}
        enablePointerInteraction={true}
         onGlobeReady={() => {
           if (globeRef.current && globeRef.current.scene) {
             const scene = globeRef.current.scene();
             
             // In react-globe.gl, the default lighting is attached to the camera, not the scene!
             // We must remove it from the camera so our custom sun light works.
             if (globeRef.current.camera) {
                const camera = globeRef.current.camera();
                const cameraLights = camera.children.filter((c: any) => c.isLight);
                cameraLights.forEach((l: any) => camera.remove(l));
             }

             // Also check the scene just in case
             const sceneLights = scene.children.filter((c: any) => c.isLight);
             sceneLights.forEach((l: any) => scene.remove(l));

             // Add our own ambient light (very dim, for the dark side)
             const ambientLight = new THREE.AmbientLight(0x222222, 0.4); 
             scene.add(ambientLight);

             // Add directional sun light
             const sunLight = new THREE.DirectionalLight(0xffffff, 4); 
             sunLight.name = "sunLight";
             scene.add(sunLight);

             // Create a visual sun orb
             const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
             const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
             const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
             sunMesh.name = "sunMesh";
             scene.add(sunMesh);
             
             // Initial position
             const coords = latLngToVector3(sunPos.lat, sunPos.lng, 2.5);
             sunLight.position.copy(coords);
             sunMesh.position.copy(coords);
           }
        }}
      />
    </div>
  );
}

// Manual conversion since getCoords isn't exposed on the ref directly
function latLngToVector3(lat: number, lng: number, radiusScale: number = 1) {
  const GLOBE_RADIUS = 100; // default in react-globe.gl
  const r = GLOBE_RADIUS * radiusScale;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(r * Math.sin(phi) * Math.cos(theta));
  const z = (r * Math.sin(phi) * Math.sin(theta));
  const y = r * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

function getSunPosition(date: Date) {
  const day = getDayOfYear(date);
  const dec = -23.44 * Math.cos((360 / 365) * (day + 10) * (Math.PI / 180));
  const utcHour = date.getUTCHours() + date.getUTCMinutes() / 60;
  const lng = 180 - (utcHour * 15);
  return { lat: dec, lng };
}

function getDayOfYear(date: Date) {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
