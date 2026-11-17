import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Eye, Plane, X } from 'lucide-react';
import { FLEET_DATA, type AircraftModel } from '../data/aviationData';

interface FleetShowcaseProps {
  onBookAircraft: (aircraftName: string) => void;
}

export function FleetShowcase({ onBookAircraft }: FleetShowcaseProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeAircraft, setActiveAircraft] = useState<AircraftModel | null>(null);
  const [viewerTab, setViewerTab] = useState<'gallery' | 'seatmap' | 'tour'>('gallery');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [selectedZoneId, setSelectedZoneId] = useState('forward');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeAircraft) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveAircraft(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeAircraft]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const delta = direction === 'left' ? -400 : 400;
    sliderRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const openCabinModal = (aircraft: AircraftModel) => {
    setActiveAircraft(aircraft);
    setViewerTab('gallery');
    setGalleryIndex(0);
    setSelectedZoneId(aircraft.seatZones[0].id);
  };

  return (
    <section id="fleet" className="bg-gray-100/80 dark:bg-[#0D1219] py-20 sm:py-24 px-6 sm:px-8 border-b border-gray-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter text-[#202A36] dark:text-slate-100">
              The Fleet
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 mt-2">
              Step inside. Every aircraft is maintained to the highest standard.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollSlider('left')}
              aria-label="Scroll fleet left"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#161F2B] hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider('right')}
              aria-label="Scroll fleet right"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#161F2B] hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable slider on desktop, stacked cards on mobile */}
        <div
          ref={sliderRef}
          className="grid grid-cols-1 gap-6 md:flex md:gap-6 md:overflow-x-auto md:snap-x md:pb-4"
        >
          {FLEET_DATA.map((aircraft) => {
            const hasFailed = failedImages[aircraft.id];
            return (
              <article
                key={aircraft.id}
                className="md:min-w-[360px] lg:min-w-[385px] md:max-w-[385px] bg-white dark:bg-[#161F2B] rounded-2xl border border-gray-300/90 dark:border-slate-800 shadow-sm overflow-hidden snap-start flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="aspect-video w-full bg-gray-100 dark:bg-slate-800 relative overflow-hidden">
                    {hasFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 text-gray-500 dark:text-slate-400 p-4">
                        <Plane className="w-8 h-8 mb-2 text-[#202A36] dark:text-slate-200" />
                        <span className="text-xs font-medium">{aircraft.name}</span>
                      </div>
                    ) : (
                      <img
                        src={aircraft.image}
                        alt={aircraft.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [aircraft.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-1">
                      {aircraft.category}
                    </div>
                    <h3 className="text-xl font-semibold text-[#202A36] dark:text-slate-100">
                      {aircraft.name}
                    </h3>

                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 text-sm text-gray-600 dark:text-slate-300 tabular-nums flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>Range {aircraft.rangeNm}</span>
                      <span aria-hidden="true">·</span>
                      <span>{aircraft.speedMach}</span>
                      <span aria-hidden="true">·</span>
                      <span>{aircraft.passengers} Passengers</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex items-center justify-between gap-4">
                  <div className="text-base font-bold text-[#202A36] dark:text-slate-100 tabular-nums">
                    From ${aircraft.hourlyRate.toLocaleString()}/hr
                  </div>
                  <button
                    type="button"
                    onClick={() => openCabinModal(aircraft)}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 dark:border-slate-700 hover:border-[#202A36] dark:hover:border-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm font-medium text-[#202A36] dark:text-slate-100 transition-colors cursor-pointer"
                  >
                    <span>View Cabin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Cabin Viewer Modal */}
      {activeAircraft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cabin-viewer-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202A36]/65 dark:bg-black/75 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveAircraft(null);
          }}
        >
          <div className="w-full max-w-3xl bg-white dark:bg-[#161F2B] rounded-3xl shadow-[0_28px_65px_-12px_rgba(15,23,42,0.38)] ring-1 ring-[#202A36]/10 border border-gray-300 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-gray-900 dark:text-slate-100">
            <div className="px-6 sm:px-8 py-5 bg-gray-50/90 dark:bg-[#111821] border-b border-gray-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  Cabin Viewer · {activeAircraft.category}
                </p>
                <h3 id="cabin-viewer-title" className="text-2xl font-semibold text-[#202A36] dark:text-slate-100">
                  {activeAircraft.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveAircraft(null)}
                aria-label="Close cabin viewer"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 sm:px-8 pt-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2">
              {[
                { id: 'gallery', label: 'Photo Gallery' },
                { id: 'seatmap', label: 'Seat Map' },
                { id: 'tour', label: 'Virtual Tour' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewerTab(tab.id as 'gallery' | 'seatmap' | 'tour')}
                  className={`min-h-[40px] px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    viewerTab === tab.id
                      ? 'bg-[#202A36] text-white dark:bg-slate-100 dark:text-[#111821]'
                      : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {viewerTab === 'gallery' && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={activeAircraft.gallery[galleryIndex].src}
                      alt={`${activeAircraft.name} - ${activeAircraft.gallery[galleryIndex].label}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {activeAircraft.gallery.map((photo, idx) => (
                        <button
                          key={photo.label}
                          type="button"
                          onClick={() => setGalleryIndex(idx)}
                          className={`min-h-[36px] px-4 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                            galleryIndex === idx
                              ? 'border-[#202A36] bg-[#202A36] text-white dark:border-slate-100 dark:bg-slate-100 dark:text-[#111821]'
                              : 'border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {photo.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-400 tabular-nums">
                      Height {activeAircraft.cabinSpecs.height} · Width {activeAircraft.cabinSpecs.width} · Baggage {activeAircraft.cabinSpecs.baggage}
                    </div>
                  </div>
                </div>
              )}

              {viewerTab === 'seatmap' && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    Top-down floorplan ({activeAircraft.passengers} passengers · Cabin length {activeAircraft.cabinSpecs.length}). Select a zone to inspect configuration.
                  </p>

                  {/* Top-Down SVG Fuselage Diagram */}
                  <div className="bg-gray-50 dark:bg-[#111821] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 overflow-x-auto">
                    <svg viewBox="0 0 680 150" className="w-full min-w-[520px] h-auto" aria-label="Aircraft top-down seat map">
                      <path
                        d="M 35 75 C 35 35, 95 25, 140 25 L 570 25 C 620 25, 650 50, 650 75 C 650 100, 620 125, 570 125 L 140 125 C 95 125, 35 115, 35 75 Z"
                        fill="#ffffff"
                        stroke="#202A36"
                        strokeWidth="2"
                      />
                      <line x1="125" y1="26" x2="125" y2="124" stroke="#E5E7EB" strokeWidth="1.5" />
                      <text x="80" y="79" textAnchor="middle" fill="#6B7280" fontSize="11" fontWeight="500">
                        Flight Deck
                      </text>

                      <g onClick={() => setSelectedZoneId('forward')} className="cursor-pointer">
                        <rect
                          x="145"
                          y="32"
                          width="145"
                          height="86"
                          rx="10"
                          fill={selectedZoneId === 'forward' ? '#202A36' : '#F3F4F6'}
                          fillOpacity={selectedZoneId === 'forward' ? 0.08 : 0.7}
                          stroke={selectedZoneId === 'forward' ? '#202A36' : 'transparent'}
                        />
                        {[165, 235].map((xPos) => (
                          <g key={xPos}>
                            <rect x={xPos} y="40" width="26" height="22" rx="5" fill="#202A36" />
                            <rect x={xPos} y="88" width="26" height="22" rx="5" fill="#202A36" />
                          </g>
                        ))}
                        <text x="217" y="78" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="600">
                          Forward Club
                        </text>
                      </g>

                      <g onClick={() => setSelectedZoneId('conference')} className="cursor-pointer">
                        <rect
                          x="305"
                          y="32"
                          width="145"
                          height="86"
                          rx="10"
                          fill={selectedZoneId === 'conference' ? '#202A36' : '#F3F4F6'}
                          fillOpacity={selectedZoneId === 'conference' ? 0.08 : 0.7}
                          stroke={selectedZoneId === 'conference' ? '#202A36' : 'transparent'}
                        />
                        <rect x="355" y="42" width="46" height="20" rx="4" fill="#4B5563" />
                        <rect x="330" y="88" width="26" height="22" rx="5" fill="#202A36" />
                        <rect x="398" y="88" width="26" height="22" rx="5" fill="#202A36" />
                        <text x="377" y="78" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="600">
                          Conference
                        </text>
                      </g>

                      <g onClick={() => setSelectedZoneId('aft')} className="cursor-pointer">
                        <rect
                          x="465"
                          y="32"
                          width="135"
                          height="86"
                          rx="10"
                          fill={selectedZoneId === 'aft' ? '#202A36' : '#F3F4F6'}
                          fillOpacity={selectedZoneId === 'aft' ? 0.08 : 0.7}
                          stroke={selectedZoneId === 'aft' ? '#202A36' : 'transparent'}
                        />
                        <rect x="482" y="40" width="76" height="20" rx="6" fill="#202A36" />
                        <rect x="482" y="90" width="76" height="20" rx="6" fill="#202A36" />
                        <text x="532" y="78" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="600">
                          Aft Suite
                        </text>
                      </g>
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeAircraft.seatZones.map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                          selectedZoneId === zone.id
                            ? 'border-[#202A36] dark:border-slate-200 bg-gray-50 dark:bg-[#1B2533]'
                            : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="text-sm font-semibold text-[#202A36] dark:text-slate-100">
                          {zone.name}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {zone.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {viewerTab === 'tour' && (
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#111821] p-6 sm:p-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#202A36] dark:bg-slate-100 text-white dark:text-[#111821] inline-flex items-center justify-center mx-auto">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-[#202A36] dark:text-slate-100">
                    Interactive 360° Cabin Walkthrough · {activeAircraft.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-slate-300 max-w-lg mx-auto">
                    Explore cabin standing height ({activeAircraft.cabinSpecs.height}), acoustic insulation, and seating layouts across all three living zones.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {activeAircraft.seatZones.map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                          selectedZoneId === zone.id
                            ? 'bg-[#202A36] text-white border-[#202A36] dark:bg-slate-100 dark:text-[#111821] dark:border-slate-100'
                            : 'bg-white dark:bg-[#161F2B] text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {zone.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-white dark:bg-[#161F2B] border border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-300 max-w-lg mx-auto">
                    {activeAircraft.seatZones.find((z) => z.id === selectedZoneId)?.description}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-[#111821] flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm font-semibold text-[#202A36] dark:text-slate-100 tabular-nums">
                From ${activeAircraft.hourlyRate.toLocaleString()}/hr
              </div>
              <button
                type="button"
                onClick={() => {
                  const name = activeAircraft.name;
                  setActiveAircraft(null);
                  onBookAircraft(name);
                }}
                className="min-h-[44px] px-6 py-2.5 rounded-full bg-[#202A36] hover:bg-[#1a2229] text-white dark:bg-slate-100 dark:hover:bg-white dark:text-[#111821] text-sm font-medium transition-colors cursor-pointer"
              >
                Book {activeAircraft.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
