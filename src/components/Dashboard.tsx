"use client";

import { useState, useRef } from "react";
import DecimalClock from "@/components/DecimalClock";
import RTSCalendar, { RTSCalendarHandle } from "@/components/RTSCalendar";
import DaylightGlobe from "@/components/DaylightGlobe";
import { RTSDate, getGregorianDateFromRTS, padZero } from "@/lib/rts";
import { CalendarDays, X } from "lucide-react";

export default function Dashboard() {
  const [selectedRTSDate, setSelectedRTSDate] = useState<RTSDate | null>(null);
  const calendarRef = useRef<RTSCalendarHandle>(null);

  // Derive Gregorian date from the selected RTS date
  const gregorianEquivalent = selectedRTSDate 
    ? getGregorianDateFromRTS(
        selectedRTSDate.year, 
        selectedRTSDate.month, 
        selectedRTSDate.day, 
        selectedRTSDate.isGlobalHoliday, 
        selectedRTSDate.holidayDayIndex
      ) 
    : null;

  return (
    <>
      {/* Top Center Gregorian Equivalent */}
      {selectedRTSDate && gregorianEquivalent && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-6 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">RTS Date</span>
              <span className="text-sm font-mono text-white">
                {selectedRTSDate.isGlobalHoliday 
                  ? `Holiday ${selectedRTSDate.holidayDayIndex}, Year ${selectedRTSDate.year}`
                  : `${selectedRTSDate.monthName} ${padZero(selectedRTSDate.day)}, ${selectedRTSDate.year}`}
              </span>
            </div>
          </div>
          
          <div className="w-px h-8 bg-white/10"></div>
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Gregorian</span>
            <span className="text-sm font-mono text-blue-400">
              {gregorianEquivalent.toLocaleDateString(undefined, { 
                timeZone: 'UTC', 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>

          <button 
            onClick={() => {
              setSelectedRTSDate(null);
              if (calendarRef.current) calendarRef.current.resetToLive();
            }}
            className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="relative z-10 w-full h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10 pt-24">
        
        {/* Left Column: Calendar & Info */}
        <div className="lg:col-span-3 flex flex-col space-y-8 z-20 lg:justify-center">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase mb-2">RTS</h1>
            <p className="text-gray-500 text-sm font-mono tracking-tight leading-relaxed max-w-xs">
              Rational Time System. <br/>
              13 months. 28 days. <br/>
              Universal decimal time.
            </p>
          </div>
          
          <div className="max-w-[320px]">
            <RTSCalendar 
              ref={calendarRef}
              selectedRTSDate={selectedRTSDate}
              onDayClick={setSelectedRTSDate}
              onLiveClick={() => setSelectedRTSDate(null)}
            />
          </div>
        </div>

        {/* Center Column: The Globe (takes up most space) */}
        <div className="lg:col-span-6 relative flex items-center justify-center -mx-10 z-10 hidden lg:flex">
          <div className="absolute inset-0 scale-125">
             <DaylightGlobe />
          </div>
        </div>

        {/* Right Column: Decimal Clock, Info */}
        <div className="lg:col-span-3 flex flex-col space-y-8 z-20 lg:items-end lg:justify-center">
          <DecimalClock />
          
          <div className="max-w-[320px] p-6 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400 font-mono leading-relaxed backdrop-blur-sm">
            <h3 className="text-gray-200 mb-2 font-bold uppercase tracking-wider">How it works</h3>
            <p className="mb-2">
              The standard day is divided into 10 hours, each containing 100 minutes, and 100 seconds. 
            </p>
            <p>
              Time zones are eliminated. The entire globe shares a single, synchronized timeline. Morning for you might be 05:00, while for someone else it&apos;s 08:00.
            </p>
          </div>
        </div>

        {/* Mobile Globe View (visible only on small screens) */}
        <div className="lg:hidden h-[400px] relative w-full overflow-hidden rounded-2xl border border-white/10 mt-8">
           <DaylightGlobe />
        </div>
      </div>
    </>
  );
}
