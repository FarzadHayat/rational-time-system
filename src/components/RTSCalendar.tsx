"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getRTSDate, RTSDate, RTS_MONTHS } from "@/lib/rts";
import { motion } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface RTSCalendarProps {
  simulatedDate?: Date | null;
  selectedRTSDate?: RTSDate | null;
  onDayClick?: (date: RTSDate) => void;
  onLiveClick?: () => void;
}

export interface RTSCalendarHandle {
  resetToLive: () => void;
}

const RTSCalendar = forwardRef<RTSCalendarHandle, RTSCalendarProps>(
  ({ simulatedDate, selectedRTSDate, onDayClick, onLiveClick }, ref) => {
    const [liveDate, setLiveDate] = useState<RTSDate | null>(null);
  
  // viewState tracks what the user is currently looking at
  const [viewState, setViewState] = useState<{
    year: number;
    month: number;
    isHoliday: boolean;
  } | null>(null);

  useEffect(() => {
    const updateTime = () => {
      // If we have a simulated date, use that instead of current time
      const activeDate = simulatedDate || new Date();
      const now = getRTSDate(activeDate);
      setLiveDate(now);
      
      // If we haven't set the view yet, or if simulatedDate changed, sync it
      setViewState(prev => {
        if (!prev || simulatedDate) {
          return { year: now.year, month: now.month, isHoliday: now.isGlobalHoliday };
        }
        return prev;
      });
    };

    updateTime();
    if (!simulatedDate) {
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [simulatedDate]);

  const handlePrev = () => {
    if (!viewState) return;
    if (viewState.isHoliday) {
      setViewState({ year: viewState.year, month: 13, isHoliday: false });
    } else if (viewState.month === 1) {
      setViewState({ year: viewState.year - 1, month: 13, isHoliday: true });
    } else {
      setViewState({ year: viewState.year, month: viewState.month - 1, isHoliday: false });
    }
  };

  const handleNext = () => {
    if (!viewState) return;
    if (viewState.isHoliday) {
      setViewState({ year: viewState.year + 1, month: 1, isHoliday: false });
    } else if (viewState.month === 13) {
      setViewState({ year: viewState.year, month: 13, isHoliday: true });
    } else {
      setViewState({ year: viewState.year, month: viewState.month + 1, isHoliday: false });
    }
  };

  const resetToLive = () => {
    if (liveDate) {
      setViewState({ year: liveDate.year, month: liveDate.month, isHoliday: liveDate.isGlobalHoliday });
    }
    if (onLiveClick) {
      onLiveClick();
    }
  };

  useImperativeHandle(ref, () => ({
    resetToLive: () => {
      if (liveDate) {
        setViewState({ year: liveDate.year, month: liveDate.month, isHoliday: liveDate.isGlobalHoliday });
      }
    }
  }));

  if (!liveDate || !viewState) {
    return <div className="animate-pulse h-80 bg-gray-800 rounded-xl w-80"></div>;
  }

  const isLiveView = 
    viewState.year === liveDate.year && 
    viewState.month === liveDate.month && 
    viewState.isHoliday === liveDate.isGlobalHoliday;

  if (viewState.isHoliday) {
    return (
      <div className="relative">
        {!isLiveView && !simulatedDate && (
          <button onClick={resetToLive} className="absolute -top-8 right-0 text-xs text-blue-400 hover:text-blue-300 flex items-center">
            <RotateCcw className="w-3 h-3 mr-1" /> Live
          </button>
        )}
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
          <div className="text-xl text-gray-500 font-mono">Year {viewState.year}</div>
          <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
        </div>
        <motion.div 
          key="holiday"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onDayClick && onDayClick({
             year: viewState.year,
             month: 13,
             day: 28 + 1, // Fallback for holiday index 1
             monthName: RTS_MONTHS[12],
             isGlobalHoliday: true,
             holidayDayIndex: 1
          })}
          className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-2xl h-[320px] text-center cursor-pointer hover:border-purple-400 transition"
        >
          <Sparkles className="w-16 h-16 text-yellow-400 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-2 tracking-wider uppercase">Unum & Duo</h2>
          <p className="text-purple-200 text-lg">Global Holidays</p>
          <p className="mt-6 text-sm text-purple-300/70 max-w-[200px]">
            The grid is suspended. Enjoy the universal days of rest.
          </p>
        </motion.div>
      </div>
    );
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="relative">
      {!isLiveView && !simulatedDate && (
        <button onClick={resetToLive} className="absolute -top-8 right-0 text-xs text-blue-400 hover:text-blue-300 flex items-center">
          <RotateCcw className="w-3 h-3 mr-1" /> Live
        </button>
      )}
      <div className="flex flex-col p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full transition -ml-2">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Month {padZero(viewState.month)}</h2>
            <div className="text-xl font-light text-white tracking-wide">{RTS_MONTHS[viewState.month - 1]} {viewState.year}</div>
          </div>
          <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full transition -mr-2">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-gray-500 uppercase tracking-wider">
          {daysOfWeek.map(d => <div key={d}>{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => {
            const dayNum = i + 1;
            const isToday = isLiveView && dayNum === liveDate.day;
            const isSelected = selectedRTSDate && 
                               selectedRTSDate.year === viewState.year && 
                               selectedRTSDate.month === viewState.month && 
                               selectedRTSDate.day === dayNum &&
                               !selectedRTSDate.isGlobalHoliday;
            
            return (
              <button 
                key={dayNum}
                onClick={() => onDayClick && onDayClick({
                   year: viewState.year,
                   month: viewState.month,
                   day: dayNum,
                   monthName: RTS_MONTHS[viewState.month - 1],
                   isGlobalHoliday: false
                })}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg text-sm font-mono transition-colors focus:outline-none
                  ${isToday 
                    ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : isSelected
                    ? 'bg-white/20 text-white border border-white/40'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                `}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
  }
);

RTSCalendar.displayName = "RTSCalendar";

export default RTSCalendar;

function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}
