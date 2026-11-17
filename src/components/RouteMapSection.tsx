import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { HUB_NODES, POPULAR_ROUTES } from '../data/aviationData';
import { GlobeBackground } from './GlobeBackground';

interface RouteMapSectionProps {
  theme: 'light' | 'dark';
  onSelectHubFlights: (hubCode: string) => void;
}

const FLIGHT_ARCS: {
  id: string;
  from: string;
  to: string;
  d: string;
}[] = [
  { id: 'LHR-JFK', from: 'LHR', to: 'JFK', d: 'M 392 112 Q 315 72 238 145' },
  { id: 'JFK-LAX', from: 'JFK', to: 'LAX', d: 'M 238 145 Q 188 128 138 162' },
  { id: 'DXB-LHR', from: 'DXB', to: 'LHR', d: 'M 518 185 Q 455 120 392 112' },
  { id: 'SIN-DXB', from: 'SIN', to: 'DXB', d: 'M 632 242 Q 575 190 518 185' },
  { id: 'LHR-SIN', from: 'LHR', to: 'SIN', d: 'M 392 112 Q 525 110 632 242' },
];

export function RouteMapSection({ theme, onSelectHubFlights }: RouteMapSectionProps) {
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  const isArcHighlighted = (from: string, to: string) => {
    if (hoveredRoute) {
      return hoveredRoute === `${from}-${to}` || hoveredRoute === `${to}-${from}`;
    }
    if (hoveredHub) {
      return from === hoveredHub || to === hoveredHub;
    }
    return false;
  };

  const destinationCards = HUB_NODES.filter((h) => h.code !== 'LHR');

  return (
    <section
      id="destinations"
      className="relative overflow-hidden bg-white dark:bg-[#111821] py-20 sm:py-24 px-6 sm:px-8 border-b border-gray-200 dark:border-slate-800/80 transition-colors"
    >
      {/* Full-Width 3D Spinning Globe Background */}
      <GlobeBackground theme={theme} />

      {/* Soft top/bottom edge blend so neighboring sections transition smoothly */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/15 to-white/80 dark:from-[#111821]/80 dark:via-transparent dark:to-[#111821]/85 pointer-events-none"
      />

      {/* Foreground Content & Cards */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-300 mb-3">
            Global Network
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#202A36] dark:text-slate-100">
            Direct access across five continents.
          </h2>
        </div>

        {/* Two-Column Layout: SVG Map + Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 rounded-2xl bg-white/85 dark:bg-[#161F2B]/82 border border-gray-300/90 dark:border-slate-700/80 shadow-sm p-4 sm:p-6">
            <svg
              viewBox="0 0 800 360"
              className="w-full h-auto"
              role="img"
              aria-label="Global private jet hub route map connecting Los Angeles, New York, London, Dubai, and Singapore"
            >
              {/* Stylized Minimalist Continent Silhouettes */}
              <g className="fill-gray-300/85 dark:fill-slate-800/90">
                <path d="M 85 95 L 210 75 L 275 115 L 250 170 L 185 190 L 130 180 L 95 140 Z" />
                <path d="M 215 210 L 275 225 L 265 305 L 225 325 L 205 265 Z" />
                <path d="M 355 75 L 445 68 L 460 125 L 405 140 L 365 125 Z" />
                <path d="M 370 155 L 455 155 L 475 235 L 425 295 L 385 245 L 360 190 Z" />
                <path d="M 465 75 L 675 78 L 710 155 L 650 235 L 560 225 L 495 195 L 465 145 Z" />
                <path d="M 625 265 L 705 265 L 715 315 L 640 320 Z" />
              </g>

              {/* Animated Dashed Flight Paths */}
              {FLIGHT_ARCS.map((arc) => {
                const highlighted = isArcHighlighted(arc.from, arc.to);
                return (
                  <path
                    key={arc.id}
                    d={arc.d}
                    fill="none"
                    strokeWidth={highlighted ? 2.4 : 1.4}
                    className={`flight-path-dash transition-colors ${
                      highlighted
                        ? 'stroke-[#202A36] dark:stroke-slate-100'
                        : 'stroke-gray-500 dark:stroke-slate-500'
                    }`}
                  />
                );
              })}

              {/* Hub Markers */}
              {HUB_NODES.map((hub) => {
                const isActive =
                  hoveredHub === hub.code || (hoveredRoute && hoveredRoute.includes(hub.code));
                return (
                  <g
                    key={hub.code}
                    transform={`translate(${hub.x}, ${hub.y})`}
                    onMouseEnter={() => setHoveredHub(hub.code)}
                    onMouseLeave={() => setHoveredHub(null)}
                    onClick={() => onSelectHubFlights(hub.code)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isActive ? 11 : 7}
                      className="fill-[#202A36] dark:fill-slate-100"
                      fillOpacity={isActive ? 0.2 : 0.1}
                    />
                    <circle
                      r={4.5}
                      className="fill-[#202A36] dark:fill-slate-100 stroke-white dark:stroke-[#161F2B]"
                      strokeWidth="1.5"
                    />
                    <text
                      y={-12}
                      textAnchor="middle"
                      className="fill-[#202A36] dark:fill-slate-200"
                      fontSize="11"
                      fontWeight={isActive ? '700' : '600'}
                    >
                      {hub.city}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-3 text-center">
              Hover a hub or route to trace non-stop sectors · Click any city to filter departures
            </p>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-white/88 dark:bg-[#161F2B]/84 border border-gray-300/90 dark:border-slate-700/80 shadow-sm p-6">
            <h3 className="text-xl font-semibold text-[#202A36] dark:text-slate-100 mb-4">
              Popular Routes
            </h3>
            <div className="divide-y divide-gray-200 dark:divide-slate-800 border-t border-b border-gray-200 dark:border-slate-800">
              {POPULAR_ROUTES.map((route) => {
                const routeKey = `${route.fromCode}-${route.toCode}`;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onMouseEnter={() => setHoveredRoute(routeKey)}
                    onMouseLeave={() => setHoveredRoute(null)}
                    onClick={() => onSelectHubFlights(route.fromCode)}
                    className="w-full py-4 px-2 flex items-center justify-between gap-4 text-left hover:bg-gray-100/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="text-base font-medium text-[#202A36] dark:text-slate-100 group-hover:translate-x-0.5 transition-transform">
                        {route.fromCity} → {route.toCity}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400 mt-0.5 tabular-nums">
                        Flight time {route.duration}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                        from ${route.startingPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400 inline-flex items-center gap-1">
                        <span>View flights</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Destination Grid (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinationCards.map((dest) => (
            <div
              key={dest.code}
              onMouseEnter={() => setHoveredHub(dest.code)}
              onMouseLeave={() => setHoveredHub(null)}
              className="rounded-2xl border border-gray-300/90 dark:border-slate-700/80 bg-white/88 dark:bg-[#161F2B]/84 shadow-sm p-6 flex flex-col justify-between hover:bg-white dark:hover:bg-[#1B2533] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-gray-600 dark:text-slate-400 mb-3">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#202A36] dark:text-slate-300" />
                    <span>{dest.country}</span>
                  </span>
                  <span className="font-medium text-gray-700 dark:text-slate-300">{dest.bestTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#202A36] dark:text-slate-100">{dest.city}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {dest.tagline}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectHubFlights(dest.code)}
                className="mt-6 min-h-[44px] inline-flex items-center gap-1.5 text-sm font-medium text-[#202A36] dark:text-slate-100 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer self-start"
              >
                <span>View Flights</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
