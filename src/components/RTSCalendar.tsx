"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getRTSDate, RTSDate, RTS_MONTHS } from "@/lib/rts";
import { motion, AnimatePresence } from "framer-motion";
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
    holidayIndex?: number;
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
          return { year: now.year, month: now.month, isHoliday: now.isGlobalHoliday, holidayIndex: now.holidayDayIndex };
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
      if (viewState.holidayIndex === 2) {
        setViewState({ year: viewState.year, month: 13, isHoliday: true, holidayIndex: 1 });
      } else {
        setViewState({ year: viewState.year, month: 13, isHoliday: false });
      }
    } else if (viewState.month === 1) {
      const prevYear = viewState.year - 1;
      const isLeap = new Date(Date.UTC(prevYear, 1, 29)).getUTCMonth() === 1;
      setViewState({ year: prevYear, month: 13, isHoliday: true, holidayIndex: isLeap ? 2 : 1 });
    } else {
      setViewState({ year: viewState.year, month: viewState.month - 1, isHoliday: false });
    }
  };

  const handleNext = () => {
    if (!viewState) return;
    if (viewState.isHoliday) {
      const isLeap = new Date(Date.UTC(viewState.year, 1, 29)).getUTCMonth() === 1;
      if (viewState.holidayIndex === 1 && isLeap) {
        setViewState({ year: viewState.year, month: 1, isHoliday: true, holidayIndex: 2 });
      } else {
        setViewState({ year: viewState.year + 1, month: 1, isHoliday: false });
      }
    } else if (viewState.month === 13) {
      setViewState({ year: viewState.year, month: 13, isHoliday: true, holidayIndex: 1 });
    } else {
      setViewState({ year: viewState.year, month: viewState.month + 1, isHoliday: false });
    }
  };

  const resetToLive = () => {
    if (liveDate) {
      setViewState({ year: liveDate.year, month: liveDate.month, isHoliday: liveDate.isGlobalHoliday, holidayIndex: liveDate.holidayDayIndex });
    }
    if (onLiveClick) {
      onLiveClick();
    }
  };

  useImperativeHandle(ref, () => ({
    resetToLive: () => {
      if (liveDate) {
        setViewState({ year: liveDate.year, month: liveDate.month, isHoliday: liveDate.isGlobalHoliday, holidayIndex: liveDate.holidayDayIndex });
      }
    }
  }));

  if (!liveDate || !viewState) {
    return <div className="animate-pulse h-80 bg-gray-800 rounded-xl w-80"></div>;
  }

  const isLiveView = 
    viewState.year === liveDate.year && 
    viewState.month === liveDate.month && 
    viewState.isHoliday === liveDate.isGlobalHoliday &&
    (!viewState.isHoliday || viewState.holidayIndex === liveDate.holidayDayIndex);

  const isSelectedDateDifferent = selectedRTSDate && (
    selectedRTSDate.year !== liveDate.year ||
    selectedRTSDate.month !== liveDate.month ||
    selectedRTSDate.day !== liveDate.day ||
    selectedRTSDate.isGlobalHoliday !== liveDate.isGlobalHoliday
  );

  const showLiveButton = (!isLiveView || isSelectedDateDifferent) && !simulatedDate;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  return (
    <div className="relative">
      <div className="flex flex-col p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-full transition -ml-2 z-10">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="text-center absolute inset-x-0 pointer-events-none">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
              {viewState.isHoliday 
                ? (viewState.holidayIndex === 2 ? "Leap Day" : "Year Day")
                : `Month ${padZero(viewState.month)}`}
            </h2>
            <div className="text-xl font-light text-white tracking-wide">
              {viewState.isHoliday ? `Year ${viewState.year}` : `${RTS_MONTHS[viewState.month - 1]} ${viewState.year}`}
            </div>
          </div>
          <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-full transition -mr-2 z-10">
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="relative h-[232px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {viewState.isHoliday ? (
              <motion.div 
                key={`holiday-${viewState.holidayIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => onDayClick && onDayClick({
                   year: viewState.year,
                   month: 13,
                   day: 28 + (viewState.holidayIndex || 1),
                   monthName: viewState.holidayIndex === 2 ? "Leap Day" : "Year Day",
                   isGlobalHoliday: true,
                   holidayDayIndex: viewState.holidayIndex || 1
                })}
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-xl border text-center cursor-pointer transition 
                  ${viewState.holidayIndex === 2 
                    ? 'bg-gradient-to-br from-amber-900/60 to-orange-900/60 border-amber-500/30 hover:border-amber-400' 
                    : 'bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-purple-500/30 hover:border-purple-400'}`
                }
              >
                <Sparkles className={`w-10 h-10 mb-3 animate-pulse ${viewState.holidayIndex === 2 ? 'text-amber-300' : 'text-yellow-400'}`} />
                <h2 className="text-2xl font-bold text-white mb-1 tracking-wider uppercase">
                  {viewState.holidayIndex === 2 ? "Leap Day" : "Year Day"}
                </h2>
                <p className={`mt-1 text-xs max-w-[200px] ${viewState.holidayIndex === 2 ? 'text-amber-300/70' : 'text-purple-300/70'}`}>
                  A day outside of time. Enjoy the universal day of rest.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showLiveButton && (
            <motion.div 
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center overflow-hidden"
            >
              <button onClick={resetToLive} className="text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-full flex items-center transition w-full justify-center">
                <RotateCcw className="w-3 h-3 mr-2" /> Return to Live Date
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
