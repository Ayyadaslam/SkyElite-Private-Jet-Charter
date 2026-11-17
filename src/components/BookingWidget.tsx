import { useState, type FormEvent } from 'react';
import { ArrowLeftRight, Check, Minus, Plane, Plus, ShieldCheck } from 'lucide-react';
import { AIRPORT_HINTS, FLEET_DATA } from '../data/aviationData';

interface BookingWidgetProps {
  initialOrigin?: string;
  initialDestination?: string;
}

type Step = 1 | 2 | 3 | 4;

export function BookingWidget({
  initialOrigin = 'LHR',
  initialDestination = 'JFK',
}: BookingWidgetProps) {
  const [step, setStep] = useState<Step>(1);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(4);
  const [selectedAircraftId, setSelectedAircraftId] = useState(FLEET_DATA[0].id);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [bookingCode, setBookingCode] = useState('');

  const handleSwapAirports = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleStep1Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setFormError('Enter both departure and arrival cities or airport codes.');
      return;
    }
    if (origin.trim().toUpperCase() === destination.trim().toUpperCase()) {
      setFormError('Departure and arrival destinations must differ.');
      return;
    }
    setFormError('');
    setStep(2);
  };

  const handleStep3Submit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      setFormError('Please provide a primary passenger name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setFormError('Please enter a valid email address for confirmation.');
      return;
    }
    setFormError('');
    setBookingCode(`SE-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep(4);
  };

  const matchingFleet = FLEET_DATA.filter((jet) => jet.passengers >= passengers);
  const availableOptions = matchingFleet.length > 0 ? matchingFleet : FLEET_DATA.slice(0, 2);
  const selectedAircraft =
    FLEET_DATA.find((j) => j.id === selectedAircraftId) || availableOptions[0];

  const multiplier = tripType === 'round-trip' ? 1.9 : 1;

  return (
    <section id="book" aria-label="Quick Flight Booking" className="px-4 sm:px-8 pb-8 bg-white dark:bg-[#111821] transition-colors">
      <div className="bg-white dark:bg-[#161F2B] rounded-2xl shadow-[0_20px_50px_-12px_rgba(32,42,54,0.2)] ring-1 ring-gray-900/8 p-6 sm:p-8 max-w-5xl mx-auto -mt-16 relative z-10 border border-gray-300/90 dark:border-slate-800 transition-colors">
        {/* 3-Step Visual Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium">
            {[
              { num: 1, label: 'Step 1 of 3: Trip' },
              { num: 2, label: 'Step 2 of 3: Schedule' },
              { num: 3, label: 'Step 3 of 3: Contact' },
            ].map((item, index) => {
              const currentNum = step === 4 ? 3 : step;
              const isActive = currentNum === item.num;
              const isDone = currentNum > item.num || step === 4;
              return (
                <div key={item.num} className="flex items-center gap-2 sm:gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 transition-colors ${
                      isActive
                        ? 'text-[#202A36] dark:text-slate-100 font-semibold'
                        : isDone
                        ? 'text-gray-700 dark:text-slate-300'
                        : 'text-gray-400 dark:text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] tabular-nums ${
                        isActive || isDone
                          ? 'bg-[#202A36] text-white dark:bg-slate-100 dark:text-[#111821]'
                          : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                      }`}
                    >
                      {isDone && step > item.num ? <Check className="w-3 h-3" /> : item.num}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {index < 2 && <span className="text-gray-300 dark:text-slate-700" aria-hidden="true">→</span>}
                </div>
              );
            })}
          </div>

          <div className="inline-flex items-center bg-gray-100 dark:bg-[#111821] p-1 rounded-full self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`min-h-[36px] px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-[#202A36] text-white dark:bg-slate-100 dark:text-[#111821]'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              One-Way
            </button>
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`min-h-[36px] px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                tripType === 'round-trip'
                  ? 'bg-[#202A36] text-white dark:bg-slate-100 dark:text-[#111821]'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
              }`}
            >
              Round-Trip
            </button>
          </div>
        </div>

        {/* Step 1: Trip Search */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit}>
            <datalist id="skyelite-airports">
              {AIRPORT_HINTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.label}
                </option>
              ))}
            </datalist>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 items-end">
                <div>
                  <label htmlFor="widget-from" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    From
                  </label>
                  <input
                    id="widget-from"
                    list="skyelite-airports"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                    placeholder="LHR, JFK, DXB..."
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm font-medium text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSwapAirports}
                  aria-label="Swap departure and arrival airports"
                  className="hidden sm:inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:text-[#202A36] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>

                <div>
                  <label htmlFor="widget-to" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    To
                  </label>
                  <input
                    id="widget-to"
                    list="skyelite-airports"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value.toUpperCase())}
                    placeholder="JFK, DXB, LAX..."
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm font-medium text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                  />
                </div>
              </div>

              <div className={tripType === 'round-trip' ? 'md:col-span-3 grid grid-cols-2 gap-2' : 'md:col-span-2'}>
                <div>
                  <label htmlFor="widget-date" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    Departure
                  </label>
                  <input
                    id="widget-date"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                  />
                </div>
                {tripType === 'round-trip' && (
                  <div>
                    <label htmlFor="widget-return-date" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                      Return
                    </label>
                    <input
                      id="widget-return-date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                    />
                  </div>
                )}
              </div>

              <div className={tripType === 'round-trip' ? 'md:col-span-2' : 'md:col-span-3'}>
                <span className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Passengers
                </span>
                <div className="flex items-center justify-between min-h-[44px] px-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821]">
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    aria-label="Decrease passengers"
                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100 tabular-nums px-2">
                    {passengers} {passengers === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.min(14, p + 1))}
                    aria-label="Increase passengers"
                    className="min-h-[36px] min-w-[36px] inline-flex items-center justify-center rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full min-h-[44px] px-5 py-2.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
                >
                  Search Flights
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                <span>Quick codes:</span>
                {['LHR', 'JFK', 'DXB', 'SIN', 'LAX'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      if (!origin) setOrigin(code);
                      else setDestination(code);
                    }}
                    className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                  >
                    {code}
                  </button>
                ))}
              </div>
              <p className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500 dark:text-slate-400 shrink-0" />
                <span>All taxes and fees included. No hidden charges.</span>
              </p>
            </div>
          </form>
        )}

        {/* Step 2: Schedule & Aircraft Selection */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-[#202A36] dark:text-slate-100">
                  Available Aircraft · {origin} → {destination}
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  {departureDate} · {passengers} {passengers === 1 ? 'passenger' : 'passengers'} ·{' '}
                  {tripType === 'round-trip' ? 'Round-Trip' : 'One-Way'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-[#202A36] dark:hover:text-white underline self-start sm:self-auto cursor-pointer"
              >
                Edit route
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableOptions.slice(0, 3).map((jet) => {
                const isSelected = selectedAircraft.id === jet.id;
                const estPrice = Math.round(jet.hourlyRate * 3.5 * multiplier);
                return (
                  <button
                    key={jet.id}
                    type="button"
                    onClick={() => setSelectedAircraftId(jet.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#202A36] dark:border-slate-200 bg-gray-50 dark:bg-[#1B2533] shadow-sm'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-white dark:bg-[#111821]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        {jet.category}
                      </span>
                      <Plane className="w-3.5 h-3.5 text-[#202A36] dark:text-slate-200" />
                    </div>
                    <div className="text-base font-semibold text-[#202A36] dark:text-slate-100">
                      {jet.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 mt-1 tabular-nums">
                      Up to {jet.passengers} seats · {jet.speedMach}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200/70 dark:border-slate-700/70 flex items-baseline justify-between">
                      <span className="text-lg font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                        ${estPrice.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-slate-400">all-in est.</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                All taxes and fees included. No hidden charges.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[44px] px-5 py-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="min-h-[44px] px-6 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
                >
                  Continue to Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 dark:bg-[#111821] rounded-xl p-4 border border-gray-200/70 dark:border-slate-800">
              <div className="text-sm">
                <span className="font-semibold text-[#202A36] dark:text-slate-100">
                  {origin} → {destination}
                </span>
                <span className="text-gray-500 dark:text-slate-400 ml-2">
                  · {selectedAircraft.name} · {departureDate} · {passengers} guests
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-[#202A36] dark:hover:text-white underline self-start sm:self-auto cursor-pointer"
              >
                Change aircraft
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="step3-name" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  id="step3-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="step3-email" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  id="step3-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="step3-phone" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Phone (Optional)
                </label>
                <input
                  id="step3-phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (212) 555-0194"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                All taxes and fees included. No hidden charges.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="min-h-[44px] px-5 py-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
                >
                  Request Flight Brief
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Step 4: Confirmed */}
        {step === 4 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#202A36] dark:text-slate-100">
                  Flight Brief Dispatched · {bookingCode}
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                  Our dispatch desk has reserved a hold on the {selectedAircraft.name} for{' '}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {origin} → {destination}
                  </span>{' '}
                  on {departureDate}. Itinerary sent to {contactEmail}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setFormError('');
              }}
              className="min-h-[44px] px-5 py-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer shrink-0"
            >
              New Search
            </button>
          </div>
        )}

        {formError && (
          <p role="alert" className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}
      </div>
    </section>
  );
}
