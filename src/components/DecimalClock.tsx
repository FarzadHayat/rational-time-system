"use client";

import { useEffect, useState } from "react";
import { getDecimalTime, padZero, DecimalTime, getRTSDate, formatRTSDate, RTSDate } from "@/lib/rts";

export default function DecimalClock({ simulatedDate }: { simulatedDate?: Date | null }) {
  const [time, setTime] = useState<DecimalTime | null>(null);
  const [date, setDate] = useState<RTSDate | null>(null);

  useEffect(() => {
    if (simulatedDate) {
      setTime(getDecimalTime(simulatedDate));
      setDate(getRTSDate(simulatedDate));
      return;
    }

    // Update the clock fast enough to catch the decimal seconds
    const interval = setInterval(() => {
      const now = new Date();
      setTime(getDecimalTime(now));
      setDate(getRTSDate(now));
    }, 50); // 50ms is plenty fast for a 864ms decimal second

    return () => clearInterval(interval);
  }, [simulatedDate]);

  if (!time || !date) {
    return <div className="animate-pulse h-24 bg-gray-800 rounded-xl w-64"></div>;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-2">Universal RTS Time</h2>
      
      <div className="flex items-baseline space-x-2 font-mono tabular-nums">
        <span className="text-6xl font-light text-white">{time.hours}</span>
        <span className="text-4xl text-gray-500">:</span>
        <span className="text-6xl font-light text-white">{padZero(time.minutes)}</span>
        <span className="text-4xl text-gray-500">:</span>
        <span className="text-6xl font-light text-blue-400">{padZero(time.seconds)}</span>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <div className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white font-mono tracking-wider text-sm mb-2">
          {formatRTSDate(date)}
        </div>
        <div className="flex space-x-4 text-xs text-gray-500">
          <div>10 Hours</div>
          <div>100 Mins</div>
          <div>100 Secs</div>
        </div>
      </div>
    </div>
  );
}
