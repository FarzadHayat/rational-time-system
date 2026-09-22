"use client";

import { useState, useRef, useEffect } from "react";
import DecimalClock from "@/components/DecimalClock";
import RTSCalendar, { RTSCalendarHandle } from "@/components/RTSCalendar";
import DaylightGlobe from "@/components/DaylightGlobe";
import { RTSDate, getGregorianDateFromRTS, padZero, getRTSDate } from "@/lib/rts";
import { CalendarDays, ChevronDown } from "lucide-react";

export default function Dashboard() {
  const [selectedRTSDate, setSelectedRTSDate] = useState<RTSDate | null>(null);
  const [liveDate, setLiveDate] = useState<RTSDate | null>(null);
  type AccordionPanel = 'info' | 'why' | 'adoption' | null;
  const [activeAccordion, setActiveAccordion] = useState<AccordionPanel>('info');
  const calendarRef = useRef<RTSCalendarHandle>(null);

  useEffect(() => {
    const updateLiveDate = () => setLiveDate(getRTSDate(new Date()));
    updateLiveDate();
    const interval = setInterval(updateLiveDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const displayDate = selectedRTSDate || liveDate;

  // Derive Gregorian date from the displayed RTS date
  const gregorianEquivalent = displayDate 
    ? getGregorianDateFromRTS(
        displayDate.year, 
        displayDate.month, 
        displayDate.day, 
        displayDate.isGlobalHoliday, 
        displayDate.holidayDayIndex
      ) 
    : null;

  return (
    <>
      {/* Top Center Gregorian Equivalent */}
      {displayDate && gregorianEquivalent && (
        <div className="fixed top-4 lg:top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 bg-black/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-full border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 w-[90%] sm:w-auto">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-bold">RTS Date</span>
              <span className="text-xs sm:text-sm font-mono text-white whitespace-nowrap">
                {displayDate.isGlobalHoliday 
                  ? `Holiday ${displayDate.holidayDayIndex}, Year ${displayDate.year}`
                  : `${displayDate.monthName} ${padZero(displayDate.day)}, ${displayDate.year}`}
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

          <div className="w-full max-w-[350px] text-xs text-gray-500 font-mono leading-relaxed mt-2 text-center lg:text-left">
            <p className="mb-2">
              The standard day is divided into 10 hours, each containing 100 minutes, and 100 seconds.
            </p>
            <p>
              Time zones are eliminated. The entire globe shares a single, synchronized timeline.
            </p>
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
              onClick={() => setActiveAccordion(activeAccordion === 'info' ? null : 'info')}
              className="w-full flex items-center justify-between text-gray-200 font-bold uppercase tracking-wider text-xs hover:text-white transition"
            >
              <span>How it works</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeAccordion === 'info' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'info' ? 'max-h-[1200px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">13 Equal Months</h4>
                  <p>Every month has exactly 28 days — 4 perfect weeks. Every month starts on Monday. Your birthday falls on the same weekday, every year, forever.</p>
                </div>

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Global Holiday</h4>
                  <p>13 × 28 = 364. The 365th day sits outside the calendar — no month, no weekday. It is a universal day of rest called <strong>Year Day</strong>. Leap years add a second holiday called <strong>Leap Day</strong>.</p>
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

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Notation & Formats</h4>
                  <p className="mb-1">Dates are written as <span className="bg-white/10 px-1 rounded">YYYY.MM.DD</span> (e.g. 2026.07.15).</p>
                  <p>Because the Global Holidays sit outside the month grid, they are written purely as <span className="bg-white/10 px-1 rounded">YYYY.H1</span> (and <span className="bg-white/10 px-1 rounded">YYYY.H2</span> for leap years).</p>
                </div>

                <div>
                  <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Historical Lineage</h4>
                  <p>RTS is a modern fusion of three brilliant historical systems: the 13-month International Fixed Calendar (used by Kodak from 1928–1989), French Republican Decimal Time (1793), and the timezone-free Swatch Internet Time (1998).</p>
                </div>

              </div>
            </div>

            {/* WHY SWITCH? (Sales Pitch) */}
            <div className="border-t border-white/10 mt-6 pt-4">
              <button 
                onClick={() => setActiveAccordion(activeAccordion === 'why' ? null : 'why')}
                className="w-full flex items-center justify-between text-gray-200 font-bold uppercase tracking-wider text-xs hover:text-white transition"
              >
                <span>Why switch?</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeAccordion === 'why' ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'why' ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">&quot;Your Time or Mine?&quot;</h4>
                    <p>Scheduling a call across three continents shouldn&apos;t require a conversion chart. Calculating your actual arrival time after a 14-hour flight shouldn&apos;t feel like a logic puzzle. In RTS, 04:00 is 04:00 everywhere.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">The Daylight Saving Ritual</h4>
                    <p>Twice a year, clocks jump. Meetings are missed. Sleep schedules break. Entire countries debate whether to keep doing it. RTS ends the ritual permanently.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">The Developer Nightmare</h4>
                    <p>Eradicate complex <span className="bg-white/10 px-1 rounded">tzdata</span> libraries, offset bugs, and leap second edge-cases from codebases entirely.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">&quot;What&apos;s 2:47 Plus 3:38?&quot;</h4>
                    <p>Base-60 arithmetic is broken for mental math. Quick — is that 6:25 or 6:15? In decimal time, durations just add up like normal numbers. Time tracking becomes trivial.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">30 Days Hath September...</h4>
                    <p>Stop memorizing which months have 28, 30, or 31 days. Stop pulling up a calendar app just to figure out what day of the week the 17th falls on. In RTS, the 17th is always a Wednesday. Always.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">Unequal Quarters</h4>
                    <p>Q1 has fewer days than Q3. Monthly payroll hits different depending on the month. Billing cycles never line up. In RTS, every quarter is exactly 91 days.</p>
                  </div>
                  <div>
                    <h4 className="text-gray-300 font-bold uppercase tracking-wider mb-1">The Final Holdout</h4>
                    <p>We weigh in grams and measure in meters — clean, base-10 systems built for logic. Yet we measure our lives using a base-60 system invented by ancient Babylonians. Time is the last major metric waiting to be modernized.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* THE TRANSITION (Adoption Strategy) */}
            <div className="border-t border-white/10 mt-6 pt-4">
              <button 
                onClick={() => setActiveAccordion(activeAccordion === 'adoption' ? null : 'adoption')}
                className="w-full flex items-center justify-between text-gray-200 font-bold uppercase tracking-wider text-xs hover:text-white transition"
              >
                <span>The Transition</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeAccordion === 'adoption' ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeAccordion === 'adoption' ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
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
