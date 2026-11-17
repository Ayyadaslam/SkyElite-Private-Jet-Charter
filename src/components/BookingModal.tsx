import { useEffect, useState, type FormEvent } from 'react';
import { Check, Plane, X } from 'lucide-react';

export type BookingTier = 'On-Demand' | 'Jet Card' | 'Program';

interface BookingModalProps {
  isOpen: boolean;
  initialRoute?: { from: string; to: string };
  initialAircraft?: string;
  initialTier?: BookingTier;
  onClose: () => void;
}

export function BookingModal({
  isOpen,
  initialRoute,
  initialAircraft = 'Gulfstream G650',
  initialTier = 'On-Demand',
  onClose,
}: BookingModalProps) {
  const [departure, setDeparture] = useState(initialRoute?.from || 'LHR');
  const [destination, setDestination] = useState(initialRoute?.to || 'JFK');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState('4');
  const [aircraft, setAircraft] = useState(initialAircraft);
  const [tier, setTier] = useState<BookingTier>(initialTier);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (initialRoute) {
      setDeparture(initialRoute.from);
      setDestination(initialRoute.to);
    }
  }, [initialRoute]);

  useEffect(() => {
    setAircraft(initialAircraft);
  }, [initialAircraft]);

  useEffect(() => {
    setTier(initialTier);
  }, [initialTier]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!departure.trim() || !destination.trim()) {
      setError('Please enter both departure and destination codes.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmittedRef(`SE-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleClose = () => {
    setSubmittedRef(null);
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="charter-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202A36]/65 dark:bg-black/75 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-[#161F2B] rounded-3xl shadow-[0_28px_65px_-12px_rgba(15,23,42,0.38)] ring-1 ring-[#202A36]/10 border border-gray-300 dark:border-slate-800 overflow-hidden text-gray-900 dark:text-slate-100">
        <div className="flex items-start justify-between gap-4 px-6 sm:px-8 py-5 bg-gray-50/90 dark:bg-[#111821] border-b border-gray-200 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1">
              SkyElite Dispatch · {tier}
            </p>
            <h2 id="charter-modal-title" className="text-2xl font-semibold tracking-tight text-[#202A36] dark:text-slate-100">
              {submittedRef ? 'Charter Brief Confirmed' : 'Reserve Private Flight'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close booking dialog"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">

        {submittedRef ? (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm sm:text-base text-gray-700 dark:text-slate-300 leading-relaxed">
              Your <span className="font-semibold text-[#202A36] dark:text-white">{tier}</span> request for{' '}
              <span className="font-semibold text-[#202A36] dark:text-white">
                {departure} → {destination}
              </span>{' '}
              aboard the <span className="font-semibold text-[#202A36] dark:text-white">{aircraft}</span> on {date} has been assigned to flight operations.
            </p>
            <div className="rounded-2xl bg-gray-50 dark:bg-[#111821] border border-gray-200 dark:border-slate-800 p-4 flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-slate-400">Dispatch Reference</span>
              <span className="font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">{submittedRef}</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full min-h-[44px] py-3 px-6 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] font-medium transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-from" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  From
                </label>
                <input
                  id="modal-from"
                  type="text"
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value.toUpperCase())}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="modal-to" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  To
                </label>
                <input
                  id="modal-to"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-date" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Departure Date
                </label>
                <input
                  id="modal-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="modal-passengers" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Passengers
                </label>
                <select
                  id="modal-passengers"
                  value={passengers}
                  onChange={(e) => setPassengers(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                >
                  {[1, 2, 4, 6, 8, 10, 12, 14].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="modal-aircraft" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                Preferred Aircraft
              </label>
              <div className="relative">
                <select
                  id="modal-aircraft"
                  value={aircraft}
                  onChange={(e) => setAircraft(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
                >
                  <option value="Gulfstream G650">Gulfstream G650 (From $12,500/hr)</option>
                  <option value="Bombardier Global 7500">Bombardier Global 7500 (From $13,800/hr)</option>
                  <option value="Cessna Citation Latitude">Cessna Citation Latitude (From $6,200/hr)</option>
                  <option value="Embraer Praetor 600">Embraer Praetor 600 (From $7,900/hr)</option>
                </select>
                <Plane className="w-4 h-4 text-gray-400 dark:text-slate-500 absolute right-9 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="modal-email" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                Contact Email
              </label>
              <input
                id="modal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#111821] text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#202A36] dark:focus:border-slate-400 transition-colors"
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-slate-400">
              All taxes and fees included. No hidden charges.
            </p>

            {error && (
              <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-5 py-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
