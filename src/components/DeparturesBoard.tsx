import { useState, type FormEvent } from 'react';
import { Bell, Check, Plane } from 'lucide-react';
import {
  ARRIVALS_DATA,
  DEPARTURES_DATA,
  EMPTY_LEGS_DATA,
  type FlightListing,
  type FlightStatus,
} from '../data/aviationData';

export type BoardTab = 'Departures' | 'Arrivals' | 'Empty Legs';

interface DeparturesBoardProps {
  activeTab: BoardTab;
  onTabChange: (tab: BoardTab) => void;
  hubFilter: string | null;
  onClearHubFilter: () => void;
  onSelectFlight: (flight: FlightListing) => void;
}

const STATUS_BADGE_STYLES: Record<FlightStatus, string> = {
  Available:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
  'Few Seats':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
  'Last Call':
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/60',
  Booked:
    'bg-gray-100 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

export function DeparturesBoard({
  activeTab,
  onTabChange,
  hubFilter,
  onClearHubFilter,
  onSelectFlight,
}: DeparturesBoardProps) {
  const [alertOpenId, setAlertOpenId] = useState<string | null>(null);
  const [alertEmail, setAlertEmail] = useState('');
  const [alertError, setAlertError] = useState('');
  const [savedAlertIds, setSavedAlertIds] = useState<Record<string, boolean>>({});

  const baseFlights =
    activeTab === 'Departures'
      ? DEPARTURES_DATA
      : activeTab === 'Arrivals'
      ? ARRIVALS_DATA
      : EMPTY_LEGS_DATA;

  const flights = hubFilter
    ? baseFlights.filter(
        (f) => f.originCode === hubFilter || f.destCode === hubFilter
      )
    : baseFlights;

  const handleAlertSubmit = (e: FormEvent, flightId: string) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail.trim())) {
      setAlertError('Enter a valid email address.');
      return;
    }
    setAlertError('');
    setSavedAlertIds((prev) => ({ ...prev, [flightId]: true }));
    setAlertOpenId(null);
    setAlertEmail('');
  };

  return (
    <section
      id="departures"
      className="bg-white dark:bg-[#111821] py-20 sm:py-24 px-6 sm:px-8 border-b border-gray-200 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#202A36] dark:text-slate-100">
                Live Departures
              </h2>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>Updated just now</span>
              </span>
            </div>
            <p className="text-base text-gray-600 dark:text-slate-300">
              Real-time seat availability across primary global hubs and verified empty-leg sectors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {hubFilter && (
              <button
                type="button"
                onClick={onClearHubFilter}
                className="min-h-[44px] px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-medium text-gray-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Hub: {hubFilter} ×
              </button>
            )}

            <div
              role="tablist"
              aria-label="Flight Schedule Views"
              className="inline-flex items-center bg-gray-100 dark:bg-[#161F2B] p-1 rounded-full border border-transparent dark:border-slate-800"
            >
              {(['Departures', 'Arrivals', 'Empty Legs'] as BoardTab[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => onTabChange(tab)}
                    className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#202A36] text-white dark:bg-slate-100 dark:text-[#111821]'
                        : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {flights.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 p-10 text-center">
            <p className="text-base font-medium text-gray-900 dark:text-slate-100 mb-2">
              No scheduled flights currently shown for {hubFilter} under {activeTab}.
            </p>
            <button
              type="button"
              onClick={onClearHubFilter}
              className="min-h-[44px] px-5 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
            >
              Show All Routes
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table Board */}
            <div className="hidden md:block rounded-2xl border border-gray-300 dark:border-slate-800 shadow-sm overflow-hidden bg-white dark:bg-[#161F2B]">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-100/80 dark:bg-[#1B2533] border-b border-gray-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400">
                <div className="col-span-2">Time</div>
                <div className="col-span-3">Route</div>
                <div className="col-span-2">Aircraft</div>
                <div className="col-span-1">Seats</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2 text-right">Status</div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-slate-800/80">
                {flights.map((flight) => {
                  const isBooked = flight.status === 'Booked';
                  const isAlertOpen = alertOpenId === flight.id;
                  const isAlertSaved = savedAlertIds[flight.id];

                  return (
                    <div key={flight.id} className="transition-all hover:bg-gray-50 dark:hover:bg-[#1B2533] hover:shadow-md">
                      <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center">
                        <div className="col-span-2">
                          <div className="text-sm font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                            {flight.time}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 tabular-nums">
                            {flight.flightDuration}
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-[#202A36] dark:text-slate-100">
                              {flight.originCode}
                            </span>
                            <span className="flex-1 flex items-center gap-1 min-w-[48px] max-w-[90px]">
                              <span className="flex-1 border-b border-dotted border-gray-400 dark:border-slate-600" />
                              <Plane className="w-3.5 h-3.5 text-[#202A36] dark:text-slate-300 shrink-0" />
                              <span className="flex-1 border-b border-dotted border-gray-400 dark:border-slate-600" />
                            </span>
                            <span className="text-sm font-semibold text-[#202A36] dark:text-slate-100">
                              {flight.destCode}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                            {flight.originCity} to {flight.destCity}
                          </div>
                        </div>

                        <div className="col-span-2 text-sm text-gray-600 dark:text-slate-300">
                          {flight.aircraft}
                        </div>

                        <div className="col-span-1 text-sm text-gray-700 dark:text-slate-300 tabular-nums">
                          {flight.seatsLeft > 0 ? `${flight.seatsLeft} left` : 'Full'}
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-[#202A36] dark:text-slate-100 tabular-nums">
                              ${flight.pricePerSeat.toLocaleString()}
                            </span>
                            {flight.discountPercent && (
                              <span className="px-2 py-0.5 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] text-[11px] font-semibold tabular-nums">
                                {flight.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-400">per seat</div>
                        </div>

                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${
                              STATUS_BADGE_STYLES[flight.status]
                            }`}
                          >
                            {flight.status}
                          </span>

                          {activeTab === 'Empty Legs' ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAlertError('');
                                setAlertOpenId(isAlertOpen ? null : flight.id);
                              }}
                              className="min-h-[36px] px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-700 hover:border-[#202A36] dark:hover:border-slate-400 text-xs font-medium text-gray-800 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {isAlertSaved ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Alert Set</span>
                                </>
                              ) : (
                                <>
                                  <Bell className="w-3.5 h-3.5" />
                                  <span>Set Alert</span>
                                </>
                              )}
                            </button>
                          ) : (
                            !isBooked && (
                              <button
                                type="button"
                                onClick={() => onSelectFlight(flight)}
                                className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                              >
                                Reserve
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {activeTab === 'Empty Legs' && isAlertOpen && (
                        <form
                          onSubmit={(e) => handleAlertSubmit(e, flight.id)}
                          className="px-6 pb-5 pt-2 bg-gray-50/80 dark:bg-[#111821]/80 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="text-xs text-gray-600 dark:text-slate-300">
                            Receive instant empty-leg notifications for{' '}
                            <span className="font-semibold text-[#202A36] dark:text-white">
                              {flight.originCode} → {flight.destCode}
                            </span>
                            :
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              value={alertEmail}
                              onChange={(e) => setAlertEmail(e.target.value)}
                              placeholder="you@domain.com"
                              aria-label="Email for empty leg alert"
                              className="min-h-[38px] px-3 py-1.5 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#161F2B] text-xs text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400"
                            />
                            <button
                              type="submit"
                              className="min-h-[38px] px-4 py-1.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-xs font-medium transition-colors cursor-pointer"
                            >
                              Notify Me
                            </button>
                          </div>
                          {alertError && (
                            <p role="alert" className="w-full text-right text-xs text-red-600 dark:text-red-400">
                              {alertError}
                            </p>
                          )}
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden space-y-4">
              {flights.map((flight) => {
                const isBooked = flight.status === 'Booked';
                const isAlertOpen = alertOpenId === flight.id;
                const isAlertSaved = savedAlertIds[flight.id];

                return (
                  <div
                    key={flight.id}
                    className="rounded-2xl border border-gray-300 dark:border-slate-800 shadow-xs p-5 bg-white dark:bg-[#161F2B] hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                        {flight.time}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-medium ${
                          STATUS_BADGE_STYLES[flight.status]
                        }`}
                      >
                        {flight.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-[#202A36] dark:text-slate-100">
                        {flight.originCode}
                      </span>
                      <span className="flex-1 flex items-center gap-1.5">
                        <span className="flex-1 border-b border-dotted border-gray-400 dark:border-slate-600" />
                        <Plane className="w-4 h-4 text-[#202A36] dark:text-slate-300" />
                        <span className="flex-1 border-b border-dotted border-gray-400 dark:border-slate-600" />
                      </span>
                      <span className="text-lg font-semibold text-[#202A36] dark:text-slate-100">
                        {flight.destCode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-300">
                      <span>{flight.aircraft}</span>
                      <span className="tabular-nums">
                        {flight.seatsLeft > 0 ? `${flight.seatsLeft} seats left` : 'Full'}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#202A36] dark:text-slate-100 tabular-nums">
                            ${flight.pricePerSeat.toLocaleString()}
                          </span>
                          {flight.discountPercent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] text-[11px] font-semibold">
                              {flight.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-slate-400">per seat</div>
                      </div>

                      {activeTab === 'Empty Legs' ? (
                        <button
                          type="button"
                          onClick={() => setAlertOpenId(isAlertOpen ? null : flight.id)}
                          className="min-h-[44px] px-4 py-2 rounded-full border border-gray-300 dark:border-slate-700 text-xs font-medium text-gray-800 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>{isAlertSaved ? 'Alert Set' : 'Set Alert'}</span>
                        </button>
                      ) : (
                        !isBooked && (
                          <button
                            type="button"
                            onClick={() => onSelectFlight(flight)}
                            className="min-h-[44px] px-5 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-xs font-medium transition-colors cursor-pointer"
                          >
                            Reserve
                          </button>
                        )
                      )}
                    </div>

                    {activeTab === 'Empty Legs' && isAlertOpen && (
                      <form
                        onSubmit={(e) => handleAlertSubmit(e, flight.id)}
                        className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-2"
                      >
                        <input
                          type="email"
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          placeholder="you@domain.com"
                          aria-label="Email for empty leg alert"
                          className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36]"
                        />
                        <button
                          type="submit"
                          className="w-full min-h-[44px] py-2 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] text-xs font-medium cursor-pointer"
                        >
                          Save Route Alert
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
