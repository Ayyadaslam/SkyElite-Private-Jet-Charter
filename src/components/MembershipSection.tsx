import { Check } from 'lucide-react';
import type { BookingTier } from './BookingModal';

interface MembershipSectionProps {
  onSelectTier: (tier: BookingTier) => void;
}

const TIERS: {
  name: BookingTier;
  price: string;
  priceNote: string;
  subtitle: string;
  highlighted?: boolean;
  badge?: string;
  ctaLabel: string;
  features: string[];
}[] = [
  {
    name: 'On-Demand',
    price: '$0',
    priceNote: 'Pay per flight',
    subtitle: 'No commitment. Charter whenever your schedule requires.',
    ctaLabel: 'Book On-Demand',
    features: [
      'Book anytime with 4-hour notice',
      'No membership fee or deposit',
      'Access to full vetted fleet',
      'Transparent all-in flight pricing',
    ],
  },
  {
    name: 'Jet Card',
    price: 'From $150k',
    priceNote: 'Flight credit',
    subtitle: 'Fixed hourly rates with guaranteed aircraft availability.',
    highlighted: true,
    badge: 'Most Popular',
    ctaLabel: 'Explore Jet Card',
    features: [
      'Locked-in rates for 12 months',
      '24-hour booking window guarantee',
      'Preferred aircraft cabin selection',
      'Flexible schedule adjustments',
    ],
  },
  {
    name: 'Program',
    price: 'Custom',
    priceNote: 'Enterprise allocation',
    subtitle: 'Custom fleet access engineered for corporate flight departments.',
    ctaLabel: 'Request Program',
    features: [
      'Dedicated account manager',
      'Custom multi-leg routing',
      'Priority empty-leg access',
      'Consolidated monthly billing',
    ],
  },
];

export function MembershipSection({ onSelectTier }: MembershipSectionProps) {
  return (
    <section id="membership" className="bg-gray-100/80 dark:bg-[#0D1219] py-20 sm:py-24 px-6 sm:px-8 border-b border-gray-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#202A36] dark:text-slate-100">
            Fly Your Way
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 mt-2">
            Choose the access that fits your schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white dark:bg-[#161F2B] rounded-2xl p-8 flex flex-col justify-between transition-all hover:shadow-lg ${
                tier.highlighted
                  ? 'border-2 border-[#202A36] dark:border-slate-200 shadow-md relative'
                  : 'border border-gray-300/90 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-[#202A36] dark:text-slate-100">{tier.name}</h3>
                  {tier.badge && (
                    <span className="px-3 py-1 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] text-xs font-medium">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 min-h-[40px]">{tier.subtitle}</p>

                <div className="pb-6 mb-6 border-b border-gray-100 dark:border-slate-800">
                  <div className="text-3xl font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                    {tier.price}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">{tier.priceNote}</div>
                </div>

                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-[#202A36] dark:text-slate-200 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectTier(tier.name)}
                className={`w-full min-h-[44px] py-3 px-6 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  tier.highlighted
                    ? 'bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821]'
                    : 'bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-slate-100'
                }`}
              >
                {tier.ctaLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
