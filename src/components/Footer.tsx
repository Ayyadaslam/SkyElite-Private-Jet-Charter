import { useState } from 'react';
import { Globe, Instagram, Linkedin, Mail, X } from 'lucide-react';

interface FooterProps {
  onOpenEmptyLegs: () => void;
  onOpenBookNow: () => void;
}

const INFO_PAGES: Record<string, { title: string; body: string }> = {
  About: {
    title: 'About SkyElite',
    body: 'Founded in 2014, SkyElite connects discerning travelers directly with audited private aviation operators across North America, Europe, the Middle East, and Asia-Pacific—without broker markups or opaque fees.',
  },
  Safety: {
    title: 'Safety & Audits',
    body: 'Every SkyElite flight is operated under FAA Part 135 or EASA Air Operator Certificates with ARGUS Platinum and IS-BAO Stage 3 verification. Captains maintain type ratings and annual simulator currency.',
  },
  Careers: {
    title: 'Careers at SkyElite',
    body: 'Our flight dispatch, concierge, and aviation operations teams work from London, New York, Dubai, and Singapore. Direct applications may be sent to flightops@skyelite.com.',
  },
  Privacy: {
    title: 'Privacy Policy',
    body: 'Passenger manifests, customs pre-clearance records, and itinerary preferences are encrypted and processed solely for flight dispatch and regulatory compliance.',
  },
  Terms: {
    title: 'Terms of Charter',
    body: 'All published hourly rates and on-demand quotes disclose applicable taxes, landing charges, and federal excise fees before dispatch confirmation.',
  },
  Accessibility: {
    title: 'Accessibility',
    body: 'SkyElite provides tarmac-level boarding assistance and cabin accommodations across all partner FBO terminals. Contact concierge for tailored boarding support.',
  },
};

export function Footer({ onOpenEmptyLegs, onOpenBookNow }: FooterProps) {
  const [activeInfoKey, setActiveInfoKey] = useState<string | null>(null);

  const activeInfo = activeInfoKey ? INFO_PAGES[activeInfoKey] : null;

  return (
    <footer className="bg-[#202A36] dark:bg-[#090D12] text-white border-t border-transparent dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <a href="#start" className="text-2xl font-semibold tracking-tight text-white inline-block">
              SkyElite
            </a>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Premium, accessible private aviation engineered around your schedule.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <a href="#fleet" className="hover:text-white transition-colors">
                  Fleet
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-white transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#departures" className="hover:text-white transition-colors">
                  Departures
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEmptyLegs}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Empty Legs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {['About', 'Safety', 'Careers'].map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActiveInfoKey(key)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {key}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onOpenBookNow}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {['Privacy', 'Terms', 'Accessibility'].map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setActiveInfoKey(key)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {key}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 SkyElite. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="#destinations"
              aria-label="SkyElite Global Network"
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setActiveInfoKey('About')}
              aria-label="SkyElite Instagram"
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveInfoKey('Careers')}
              aria-label="SkyElite LinkedIn"
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenBookNow}
              aria-label="Contact SkyElite Dispatch"
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal for Company / Legal Links */}
      {activeInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-info-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202A36]/65 dark:bg-black/75 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveInfoKey(null);
          }}
        >
          <div className="w-full max-w-md bg-white dark:bg-[#161F2B] text-gray-900 dark:text-slate-100 rounded-3xl shadow-[0_28px_65px_-12px_rgba(15,23,42,0.38)] ring-1 ring-[#202A36]/10 border border-gray-300 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 bg-gray-50/90 dark:bg-[#111821] border-b border-gray-200 dark:border-slate-800">
              <h4 id="footer-info-title" className="text-xl font-semibold text-[#202A36] dark:text-slate-100">
                {activeInfo.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveInfoKey(null)}
                aria-label="Close information dialog"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-6">
                {activeInfo.body}
              </p>
              <button
                type="button"
                onClick={() => setActiveInfoKey(null)}
                className="w-full min-h-[44px] py-2.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
