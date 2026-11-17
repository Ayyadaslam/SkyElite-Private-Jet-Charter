/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BookingModal, type BookingTier } from './components/BookingModal';
import { BookingWidget } from './components/BookingWidget';
import { DeparturesBoard, type BoardTab } from './components/DeparturesBoard';
import { FleetShowcase } from './components/FleetShowcase';
import { Footer } from './components/Footer';
import { MembershipSection } from './components/MembershipSection';
import { Navbar } from './components/Navbar';
import { RouteMapSection } from './components/RouteMapSection';
import { SignInModal } from './components/SignInModal';
import { TrustAndFaqSection } from './components/TrustAndFaqSection';
import type { FlightListing } from './data/aviationData';

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_091828_e240eb17-6edc-4129-ad9d-98678e3fd238.mp4';

type ThemeMode = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('skyelite-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('skyelite-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [modalRoute, setModalRoute] = useState<{ from: string; to: string }>({
    from: 'LHR',
    to: 'JFK',
  });
  const [modalAircraft, setModalAircraft] = useState('Gulfstream G650');
  const [modalTier, setModalTier] = useState<BookingTier>('On-Demand');

  const [boardTab, setBoardTab] = useState<BoardTab>('Departures');
  const [hubFilter, setHubFilter] = useState<string | null>(null);

  const openBookModal = (options?: {
    from?: string;
    to?: string;
    aircraft?: string;
    tier?: BookingTier;
  }) => {
    setModalRoute({
      from: options?.from || 'LHR',
      to: options?.to || 'JFK',
    });
    setModalAircraft(options?.aircraft || 'Gulfstream G650');
    setModalTier(options?.tier || 'On-Demand');
    setIsBookingOpen(true);
  };

  const handleSelectFlight = (flight: FlightListing) => {
    openBookModal({
      from: flight.originCode,
      to: flight.destCode,
      aircraft: flight.aircraft,
      tier: 'On-Demand',
    });
  };

  const handleSelectHubFlights = (hubCode: string) => {
    setHubFilter(hubCode);
    setBoardTab('Departures');
    const el = document.getElementById('departures');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenEmptyLegs = () => {
    setHubFilter(null);
    setBoardTab('Empty Legs');
    const el = document.getElementById('departures');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0D1219] text-gray-900 dark:text-slate-100 transition-colors">
      {/* Section 1: Sticky Nav with Backdrop Blur & Theme Toggle */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSignIn={() => setIsSignInOpen(true)}
        onOpenBookNow={() => openBookModal()}
      />

      {/* Section 2: Hero (Preserved with Dark Mode Atmospheric Scrim) */}
      <section id="start" className="relative h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent dark:from-[#0B1016]/85 dark:via-[#0B1016]/55 dark:to-[#0D1219]/85 pointer-events-none transition-colors"
        />

        <div className="relative h-full flex flex-col pt-20">
          <main className="flex-1 flex items-center justify-center px-6">
            <div className="-mt-40 sm:-mt-64 md:-mt-80 text-center flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-600 dark:text-slate-300 tracking-wider uppercase mb-4 transition-colors">
                PRIVATE JETS
              </p>

              <h1 className="flex flex-col items-center select-none">
                <span className="text-6xl md:text-7xl lg:text-8xl font-normal text-gray-500 dark:text-slate-400 leading-none tracking-tighter transition-colors">
                  Premium.
                </span>
                <span className="text-6xl md:text-7xl lg:text-8xl font-normal text-[#202A36] dark:text-white leading-none tracking-tighter -mt-[12px] transition-colors">
                  Accessible.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 dark:text-slate-300 mt-4 mb-6 max-w-2xl transition-colors">
                Your dedication deserves recognition.
              </p>

              <div className="flex items-center justify-center gap-4">
                <a
                  href="#fleet"
                  className="px-4 py-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-white/15 dark:text-white dark:hover:bg-white/25 font-medium transition-colors whitespace-nowrap shrink-0 backdrop-blur-sm"
                >
                  Discover
                </a>
                <button
                  type="button"
                  onClick={() => openBookModal()}
                  className="px-4 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Book Now
                </button>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Section 3: Quick Booking Widget */}
      <BookingWidget />

      {/* Section 4: Live Departures Board */}
      <DeparturesBoard
        activeTab={boardTab}
        onTabChange={setBoardTab}
        hubFilter={hubFilter}
        onClearHubFilter={() => setHubFilter(null)}
        onSelectFlight={handleSelectFlight}
      />

      {/* Section 5: Fleet Showcase */}
      <FleetShowcase
        onBookAircraft={(aircraft) => openBookModal({ aircraft })}
      />

      {/* Section 6: Route Map & Destinations */}
      <RouteMapSection theme={theme} onSelectHubFlights={handleSelectHubFlights} />

      {/* Section 7: Membership / Jet Card Tiers */}
      <MembershipSection
        onSelectTier={(tier) => openBookModal({ tier })}
      />

      {/* Sections 8 & 9: Trust & Social Proof + FAQ Accordion */}
      <TrustAndFaqSection theme={theme} />

      {/* Section 10: Dark Footer */}
      <Footer
        onOpenEmptyLegs={handleOpenEmptyLegs}
        onOpenBookNow={() => openBookModal()}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        initialRoute={modalRoute}
        initialAircraft={modalAircraft}
        initialTier={modalTier}
        onClose={() => setIsBookingOpen(false)}
      />
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </div>
  );
}
