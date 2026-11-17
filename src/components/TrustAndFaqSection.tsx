import { useState } from 'react';
import { Award, ChevronDown, ShieldCheck } from 'lucide-react';
import { FAQ_ITEMS } from '../data/aviationData';
import { TrustAtmosphereBackground } from './TrustAtmosphereBackground';

interface TrustAndFaqSectionProps {
  theme: 'light' | 'dark';
}

export function TrustAndFaqSection({ theme }: TrustAndFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Section 8: Trust & Social Proof */}
      <section
        aria-label="Trust and Safety Credentials"
        className="relative overflow-hidden bg-white dark:bg-[#111821] py-20 sm:py-24 px-6 sm:px-8 border-b border-gray-200 dark:border-slate-800/80 transition-colors"
      >
        {/* Full-Width Three.js Stratospheric Aviation Animation */}
        <TrustAtmosphereBackground theme={theme} />

        {/* Subtle vertical/center contrast guard for crisp quote legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/35 to-white/75 dark:from-[#111821]/80 dark:via-[#111821]/30 dark:to-[#111821]/80 pointer-events-none"
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-14">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-gray-200 dark:border-slate-800">
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                12+
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Years of Service</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                180+
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Aircraft</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                50,000+
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">Flights</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">On-Time</div>
            </div>
          </div>

          {/* Single Large Quote */}
          <figure className="max-w-3xl mx-auto">
            <blockquote className="text-xl sm:text-2xl font-light text-gray-700 dark:text-slate-200 leading-relaxed">
              “SkyElite removed every layer of friction from transatlantic travel. We walk straight onto the aircraft fifteen minutes before takeoff with total clarity on cost.”
            </blockquote>
            <figcaption className="mt-6 text-sm font-medium text-gray-900 dark:text-slate-300">
              Elena Vance · Managing Partner, Horizon Capital
            </figcaption>
          </figure>

          {/* Safety Badge Strip */}
          <div className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm font-medium text-gray-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#202A36] dark:text-slate-200" />
              <span>ARGUS Platinum</span>
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-slate-700" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-2">
              <Award className="w-4 h-4 text-[#202A36] dark:text-slate-200" />
              <span>IS-BAO Stage 3</span>
            </span>
            <span className="hidden sm:inline text-gray-300 dark:text-slate-700" aria-hidden="true">|</span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#202A36] dark:text-slate-200" />
              <span>FAA Certified</span>
            </span>
          </div>
        </div>
      </section>

      {/* Section 9: FAQ Accordion */}
      <section id="faq" className="bg-gray-100/80 dark:bg-[#0D1219] py-20 sm:py-24 px-6 sm:px-8 transition-colors">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#202A36] dark:text-slate-100">
              Questions, answered.
            </h2>
          </div>

          <div className="bg-white dark:bg-[#161F2B] rounded-2xl border border-gray-300/90 dark:border-slate-800 shadow-sm px-6 sm:px-8 divide-y divide-gray-200 dark:divide-slate-800">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question} className="transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-[56px] py-5 flex items-center justify-between gap-4 text-left cursor-pointer group"
                  >
                    <span className="text-base font-medium text-[#202A36] dark:text-slate-100 group-hover:text-gray-600 dark:group-hover:text-slate-300 transition-colors">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 dark:text-slate-400 shrink-0 transition-all duration-200 ${
                        isOpen ? 'rotate-180 text-[#202A36] dark:text-slate-100' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
