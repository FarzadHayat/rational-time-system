"use client";

import { useState, useRef } from "react";
import DecimalClock from "@/components/DecimalClock";
import RTSCalendar, { RTSCalendarHandle } from "@/components/RTSCalendar";
import DaylightGlobe from "@/components/DaylightGlobe";
import { RTSDate, getGregorianDateFromRTS, padZero } from "@/lib/rts";
import { CalendarDays, X, ChevronDown } from "lucide-react";

export default function Dashboard() {
  const [selectedRTSDate, setSelectedRTSDate] = useState<RTSDate | null>(null);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [adoptionExpanded, setAdoptionExpanded] = useState(false);
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
        <div className="fixed top-4 lg:top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 bg-black/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] sm:w-auto">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-bold">RTS Date</span>
              <span className="text-xs sm:text-sm font-mono text-white whitespace-nowrap">
                {selectedRTSDate.isGlobalHoliday 
                  ? `Holiday ${selectedRTSDate.holidayDayIndex}, Year ${selectedRTSDate.year}`
                  : `${selectedRTSDate.monthName} ${padZero(selectedRTSDate.day)}, ${selectedRTSDate.year}`}
              </span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-white/10"></div>
          
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-bold">Gregorian</span>
              <span className="text-xs sm:text-sm font-mono text-blue-400 whitespace-nowrap">
                {gregorianEquivalent.toLocaleDateString(undefined, { 
                  timeZone: 'UTC', 
                  month: 'short', 
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
              className="ml-4 p-1.5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white sm:ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="relative z-10 w-full min-h-screen lg:h-screen grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10 pt-28 lg:pt-24 lg:overflow-hidden">
        
        {/* Left Column: Calendar & Info */}
        <div className="lg:col-span-3 flex flex-col space-y-6 lg:space-y-8 z-20 lg:justify-center items-center lg:items-start text-center lg:text-left">
          <div>
            <h1 className="text-3xl font-light tracking-widest uppercase mb-2">RTS</h1>
            <p className="text-gray-500 text-sm font-mono tracking-tight leading-relaxed max-w-xs">
              Rational Time System. <br/>
              13 months. 28 days. <br/>
              Universal decimal time.
            </p>
          </div>
          
          <div className="w-full max-w-[350px]">
            <RTSCalendar 
              ref={calendarRef}
              selectedRTSDate={selectedRTSDate}
              onDayClick={setSelectedRTSDate}
              onLiveClick={() => setSelectedRTSDate(null)}
            />
          </div>
        </div>

        {/* Center Column: The Globe (takes up most space on desktop) */}
        <div className="lg:col-span-6 relative flex items-center justify-center -mx-10 z-10 hidden lg:flex">
          <div className="absolute inset-0 scale-125">
             <DaylightGlobe />
          </div>
        </div>

        {/* Right Column: Decimal Clock, Info */}
        <div className="lg:col-span-3 flex flex-col space-y-6 lg:space-y-8 z-20 items-center lg:items-end lg:justify-center text-center lg:text-right">
          
          <div className="w-full max-w-[350px]">
            <DecimalClock />
          </div>
          
          <div className="w-full max-w-[350px] p-6 bg-white/5 rounded-2xl border border-white/5 text-xs text-gray-400 font-mono leading-relaxed backdrop-blur-sm text-left flex flex-col">
            
            <button 
              onClick={() => setInfoExpanded(!infoExpanded)}
              className="w-full flex items-center justify-between text-gray-200 mb-3 font-bold uppercase tracking-wider text-xs hover:text-white transition"
            >
              <span>How it works</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${infoExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            <p className="mb-2">
              The standard day is divided into 10 hours, each containing 100 minutes, and 100 seconds. 
            </p>
            <p>
              Time zones are eliminated. The entire globe shares a single, synchronized timeline.
            </p>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${infoExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 border-t border-white/10 pt-4">
                
                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">13 Equal Months</h4>
                  <p>Every month has exactly 28 days — 4 perfect weeks. Every month starts on Monday. Your birthday falls on the same weekday, every year, forever.</p>
                </div>

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Global Holiday</h4>
                  <p>13 × 28 = 364. The 365th day sits outside the calendar — no month, no weekday. A universal day of rest. Leap years add a second holiday.</p>
                </div>

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Month Names</h4>
                  <p>Latin ordinals: Primus, Secundus, Tertius… through Duodecimus. The 13th month is Terminus — &quot;the boundary.&quot;</p>
                </div>

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Decimal Conversion</h4>
                  <p className="mb-1">1 decimal second ≈ 0.864 standard seconds.</p>
                  <p>1 decimal hour = 2 hrs 24 min standard.</p>
                </div>

              </div>
            </div>

            {/* WHY SWITCH? (Sales Pitch) */}
            <div className="border-t border-white/10 mt-6 pt-4">
              <button 
                onClick={() => setWhyExpanded(!whyExpanded)}
                className="w-full flex items-center justify-between text-gray-200 font-bold uppercase tracking-wider text-xs hover:text-white transition"
              >
                <span>Why switch?</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${whyExpanded ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${whyExpanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">&quot;Your Time or Mine?&quot;</h4>
                    <p>Stop doing mental timezone math for global meetings. 04:00 is 04:00 everywhere. Say goodbye to Daylight Saving desyncs.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Time Travel Flights</h4>
                    <p>No more departing at 10:00, flying for 14 hours, and arriving at 12:00 local time. Durations actually match the clock.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">The Developer Nightmare</h4>
                    <p>Eradicate complex <span className="bg-white/10 px-1 rounded">tzdata</span> libraries, offset bugs, and leap second edge-cases from codebases entirely.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">30 Days Hath September...</h4>
                    <p>Stop memorizing which months have 28, 30, or 31 days. Stop worrying about unequal quarters or February payroll imbalances.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* THE TRANSITION (Adoption Strategy) */}
            <div className="border-t border-white/10 mt-6 pt-4">
              <button 
                onClick={() => setAdoptionExpanded(!adoptionExpanded)}
                className="w-full flex items-center justify-between text-gray-200 font-bold uppercase tracking-wider text-xs hover:text-white transition"
              >
                <span>The Transition</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${adoptionExpanded ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${adoptionExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4 pt-2">

                  <p className="text-gray-500 italic">RTS isn&apos;t a revolution — it&apos;s a parallel system. No one wakes up to a new clock. You adopt it when it makes your life easier.</p>

                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">
                      <span className="text-blue-400 mr-1">01</span> Dual Display
                    </h4>
                    <p>Clocks, apps, and dashboards show both systems side by side — like road signs in countries transitioning to metric. Familiarity builds naturally.</p>
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">
                      <span className="text-blue-400 mr-1">02</span> Industry First
                    </h4>
                    <p>Global tech, finance, and aviation already use UTC internally. RTS replaces UTC as the coordination layer — no public-facing change required.</p>
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">
                      <span className="text-blue-400 mr-1">03</span> Opt-In Culture
                    </h4>
                    <p>Operating systems and phones offer RTS as a display option. Early adopters switch their personal devices. Social proof does the rest.</p>
                  </div>

                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">
                      <span className="text-blue-400 mr-1">04</span> Sunset Legacy
                    </h4>
                    <p>Once a critical mass is reached, the Gregorian calendar becomes the &quot;imperial&quot; system — still understood, rarely used. The transition completes itself.</p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Globe View (visible only on small screens) */}
        <div className="lg:hidden h-[400px] w-full relative overflow-hidden rounded-2xl border border-white/10 mt-4 mb-10">
           <DaylightGlobe />
        </div>
      </div>
    </>
  );
}
