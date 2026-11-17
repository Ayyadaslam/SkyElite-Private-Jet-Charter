export type FlightStatus = 'Available' | 'Few Seats' | 'Last Call' | 'Booked';

export interface FlightListing {
  id: string;
  time: string;
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  aircraft: string;
  seatsLeft: number;
  pricePerSeat: number;
  status: FlightStatus;
  flightDuration: string;
  discountPercent?: number;
  dateLabel?: string;
}

export interface AircraftModel {
  id: string;
  name: string;
  category: 'Heavy Jet' | 'Ultra-Long-Range' | 'Midsize' | 'Super-Midsize';
  rangeNm: string;
  speedMach: string;
  passengers: number;
  hourlyRate: number;
  image: string;
  gallery: { label: string; src: string }[];
  cabinSpecs: {
    height: string;
    width: string;
    length: string;
    baggage: string;
  };
  seatZones: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface HubNode {
  code: string;
  city: string;
  country: string;
  x: number;
  y: number;
  bestTime: string;
  tagline: string;
}

export interface PopularRoute {
  id: string;
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  duration: string;
  startingPrice: number;
}

export const AIRPORT_HINTS = [
  { code: 'LHR', label: 'London Farnborough / Heathrow (LHR)' },
  { code: 'JFK', label: 'New York Teterboro / JFK (JFK)' },
  { code: 'DXB', label: 'Dubai Al Maktoum / DXB (DXB)' },
  { code: 'SIN', label: 'Singapore Seletar / Changi (SIN)' },
  { code: 'LAX', label: 'Los Angeles Van Nuys / LAX (LAX)' },
  { code: 'GVA', label: 'Geneva Private Terminal (GVA)' },
  { code: 'ASE', label: 'Aspen-Pitkin County (ASE)' },
  { code: 'NCE', label: 'Nice Côte d’Azur (NCE)' },
];

export const DEPARTURES_DATA: FlightListing[] = [
  {
    id: 'dep-1',
    time: '08:30',
    originCode: 'LHR',
    originCity: 'London',
    destCode: 'JFK',
    destCity: 'New York',
    aircraft: 'Gulfstream G650',
    seatsLeft: 6,
    pricePerSeat: 14800,
    status: 'Available',
    flightDuration: '7h 45m',
  },
  {
    id: 'dep-2',
    time: '10:15',
    originCode: 'JFK',
    originCity: 'New York',
    destCode: 'LAX',
    destCity: 'Los Angeles',
    aircraft: 'Bombardier Global 7500',
    seatsLeft: 3,
    pricePerSeat: 11200,
    status: 'Few Seats',
    flightDuration: '5h 30m',
  },
  {
    id: 'dep-3',
    time: '12:40',
    originCode: 'DXB',
    originCity: 'Dubai',
    destCode: 'LHR',
    destCity: 'London',
    aircraft: 'Gulfstream G650',
    seatsLeft: 2,
    pricePerSeat: 16400,
    status: 'Last Call',
    flightDuration: '7h 10m',
  },
  {
    id: 'dep-4',
    time: '14:20',
    originCode: 'LAX',
    originCity: 'Los Angeles',
    destCode: 'ASE',
    destCity: 'Aspen',
    aircraft: 'Cessna Citation Latitude',
    seatsLeft: 5,
    pricePerSeat: 5900,
    status: 'Available',
    flightDuration: '2h 15m',
  },
  {
    id: 'dep-5',
    time: '16:50',
    originCode: 'SIN',
    originCity: 'Singapore',
    destCode: 'DXB',
    destCity: 'Dubai',
    aircraft: 'Bombardier Global 7500',
    seatsLeft: 0,
    pricePerSeat: 15900,
    status: 'Booked',
    flightDuration: '7h 20m',
  },
  {
    id: 'dep-6',
    time: '19:10',
    originCode: 'LHR',
    originCity: 'London',
    destCode: 'GVA',
    destCity: 'Geneva',
    aircraft: 'Embraer Praetor 600',
    seatsLeft: 4,
    pricePerSeat: 4650,
    status: 'Available',
    flightDuration: '1h 40m',
  },
];

export const ARRIVALS_DATA: FlightListing[] = [
  {
    id: 'arr-1',
    time: '09:05',
    originCode: 'JFK',
    originCity: 'New York',
    destCode: 'LHR',
    destCity: 'London',
    aircraft: 'Bombardier Global 7500',
    seatsLeft: 4,
    pricePerSeat: 14500,
    status: 'Available',
    flightDuration: '6h 55m',
  },
  {
    id: 'arr-2',
    time: '11:30',
    originCode: 'GVA',
    originCity: 'Geneva',
    destCode: 'DXB',
    destCity: 'Dubai',
    aircraft: 'Gulfstream G650',
    seatsLeft: 2,
    pricePerSeat: 13900,
    status: 'Few Seats',
    flightDuration: '6h 20m',
  },
  {
    id: 'arr-3',
    time: '13:45',
    originCode: 'LAX',
    originCity: 'Los Angeles',
    destCode: 'SIN',
    destCity: 'Singapore',
    aircraft: 'Bombardier Global 7500',
    seatsLeft: 5,
    pricePerSeat: 19200,
    status: 'Available',
    flightDuration: '15h 40m',
  },
  {
    id: 'arr-4',
    time: '17:20',
    originCode: 'NCE',
    originCity: 'Nice',
    destCode: 'LHR',
    destCity: 'London',
    aircraft: 'Cessna Citation Latitude',
    seatsLeft: 1,
    pricePerSeat: 4100,
    status: 'Last Call',
    flightDuration: '2h 00m',
  },
];

export const EMPTY_LEGS_DATA: FlightListing[] = [
  {
    id: 'emp-1',
    time: 'Tomorrow · 09:00',
    originCode: 'LHR',
    originCity: 'London',
    destCode: 'NCE',
    destCity: 'Nice',
    aircraft: 'Cessna Citation Latitude',
    seatsLeft: 8,
    pricePerSeat: 2450,
    status: 'Available',
    flightDuration: '1h 55m',
    discountPercent: 45,
  },
  {
    id: 'emp-2',
    time: 'Thu · 15:30',
    originCode: 'JFK',
    originCity: 'New York',
    destCode: 'ASE',
    destCity: 'Aspen',
    aircraft: 'Embraer Praetor 600',
    seatsLeft: 6,
    pricePerSeat: 4800,
    status: 'Few Seats',
    flightDuration: '4h 15m',
    discountPercent: 50,
  },
  {
    id: 'emp-3',
    time: 'Fri · 11:15',
    originCode: 'DXB',
    originCity: 'Dubai',
    destCode: 'GVA',
    destCity: 'Geneva',
    aircraft: 'Gulfstream G650',
    seatsLeft: 10,
    pricePerSeat: 7200,
    status: 'Available',
    flightDuration: '6h 30m',
    discountPercent: 40,
  },
  {
    id: 'emp-4',
    time: 'Sat · 18:00',
    originCode: 'LAX',
    originCity: 'Los Angeles',
    destCode: 'JFK',
    destCity: 'New York',
    aircraft: 'Bombardier Global 7500',
    seatsLeft: 3,
    pricePerSeat: 6150,
    status: 'Last Call',
    flightDuration: '4h 50m',
    discountPercent: 55,
  },
];

export const FLEET_DATA: AircraftModel[] = [
  {
    id: 'g650',
    name: 'Gulfstream G650',
    category: 'Ultra-Long-Range',
    rangeNm: '7,000 nm',
    speedMach: 'Mach 0.90',
    passengers: 14,
    hourlyRate: 12500,
    image: '/src/assets/images/fleet_gulfstream_g650_1794910683051.jpg',
    gallery: [
      { label: 'Exterior Profile', src: '/src/assets/images/fleet_gulfstream_g650_1794910683051.jpg' },
      { label: 'Main Salon', src: '/src/assets/images/fleet_cabin_interior_1794910684438.jpg' },
    ],
    cabinSpecs: {
      height: '6 ft 5 in',
      width: '8 ft 6 in',
      length: '46 ft 10 in',
      baggage: '195 cu ft',
    },
    seatZones: [
      {
        id: 'forward',
        name: 'Forward Club Suite',
        description: 'Four wide cream leather executive seats with fold-out walnut tables and panoramic windows.',
      },
      {
        id: 'conference',
        name: 'Mid-Cabin Conference',
        description: 'Four-place dining and briefing area facing a high-definition display and dedicated credenza.',
      },
      {
        id: 'aft',
        name: 'Aft Private Stateroom',
        description: 'Dual three-place berthable divans convertible into quiet sleeping suites with private lavatory.',
      },
    ],
  },
  {
    id: 'global-7500',
    name: 'Bombardier Global 7500',
    category: 'Ultra-Long-Range',
    rangeNm: '7,700 nm',
    speedMach: 'Mach 0.925',
    passengers: 16,
    hourlyRate: 13800,
    image: '/src/assets/images/fleet_global_7500_1794910682382.jpg',
    gallery: [
      { label: 'Cruising Altitude', src: '/src/assets/images/fleet_global_7500_1794910682382.jpg' },
      { label: 'Executive Cabin', src: '/src/assets/images/fleet_cabin_interior_1794910684438.jpg' },
    ],
    cabinSpecs: {
      height: '6 ft 2 in',
      width: '8 ft 0 in',
      length: '54 ft 5 in',
      baggage: '195 cu ft',
    },
    seatZones: [
      {
        id: 'forward',
        name: 'Club Four Lounge',
        description: 'Deep-recline Nuage seating engineered for zero-gravity spinal comfort on 14-hour crossings.',
      },
      {
        id: 'conference',
        name: 'Six-Place Dining Suite',
        description: 'Full culinary service table with dual Ka-band satellite connectivity for uninterrupted calls.',
      },
      {
        id: 'aft',
        name: 'Principal Bedroom',
        description: 'Acoustic-isolated aft suite with permanent full-size berth and stand-up shower.',
      },
    ],
  },
  {
    id: 'citation-latitude',
    name: 'Cessna Citation Latitude',
    category: 'Midsize',
    rangeNm: '2,700 nm',
    speedMach: 'Mach 0.80',
    passengers: 9,
    hourlyRate: 6200,
    image: '/src/assets/images/fleet_citation_latitude_1794910683173.jpg',
    gallery: [
      { label: 'Ramp Arrival', src: '/src/assets/images/fleet_citation_latitude_1794910683173.jpg' },
      { label: 'Flat-Floor Interior', src: '/src/assets/images/fleet_cabin_interior_1794910684438.jpg' },
    ],
    cabinSpecs: {
      height: '6 ft 0 in',
      width: '6 ft 5 in',
      length: '21 ft 9 in',
      baggage: '127 cu ft',
    },
    seatZones: [
      {
        id: 'forward',
        name: 'Forward Refreshment & Divan',
        description: 'Two-place side-facing divan opposite a hot espresso and cold refreshment galley.',
      },
      {
        id: 'conference',
        name: 'Center Club Quartet',
        description: 'Six-foot stand-up flat floor cabin with wireless cabin lighting and climate control.',
      },
      {
        id: 'aft',
        name: 'Aft Executive Pair',
        description: 'Two forward-facing swivel armchairs adjacent to the enclosed aft lavatory.',
      },
    ],
  },
  {
    id: 'praetor-600',
    name: 'Embraer Praetor 600',
    category: 'Super-Midsize',
    rangeNm: '4,018 nm',
    speedMach: 'Mach 0.83',
    passengers: 12,
    hourlyRate: 7900,
    image: '/src/assets/images/fleet_cabin_interior_1794910684438.jpg',
    gallery: [
      { label: 'Bossa Nova Cabin', src: '/src/assets/images/fleet_cabin_interior_1794910684438.jpg' },
      { label: 'Exterior Profile', src: '/src/assets/images/fleet_gulfstream_g650_1794910683051.jpg' },
    ],
    cabinSpecs: {
      height: '6 ft 0 in',
      width: '6 ft 10 in',
      length: '27 ft 6 in',
      baggage: '155 cu ft',
    },
    seatZones: [
      {
        id: 'forward',
        name: 'Forward Club Zone',
        description: '5,800 ft cabin altitude at 45,000 ft keeps passengers rested on transoceanic sectors.',
      },
      {
        id: 'conference',
        name: 'Mid-Cabin Lounge',
        description: 'Full-berthable club seats with HEPA air filtration and whisper-quiet acoustic insulation.',
      },
      {
        id: 'aft',
        name: 'Aft Divan & Vanity',
        description: 'Convertible three-seat divan with access to an expansive walk-in baggage compartment.',
      },
    ],
  },
];

export const HUB_NODES: HubNode[] = [
  {
    code: 'LAX',
    city: 'Los Angeles',
    country: 'United States',
    x: 138,
    y: 162,
    bestTime: 'Year-Round',
    tagline: 'Private Van Nuys ramp with direct coastal heli-transfers.',
  },
  {
    code: 'JFK',
    city: 'New York',
    country: 'United States',
    x: 238,
    y: 145,
    bestTime: 'Apr – Oct',
    tagline: 'Teterboro and JFK executive terminals 20 minutes from Manhattan.',
  },
  {
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    x: 392,
    y: 112,
    bestTime: 'May – Sep',
    tagline: 'Farnborough and Heathrow VIP suites with customs pre-clearance.',
  },
  {
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    x: 518,
    y: 185,
    bestTime: 'Nov – Mar',
    tagline: 'Al Maktoum Jet Terminal connecting Europe, Africa, and Asia.',
  },
  {
    code: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
    x: 632,
    y: 242,
    bestTime: 'Feb – Aug',
    tagline: 'Seletar Private Aviation Centre with five-minute tarmac arrival.',
  },
];

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'route-lhr-jfk',
    fromCity: 'London',
    fromCode: 'LHR',
    toCity: 'New York',
    toCode: 'JFK',
    duration: '7h 45m',
    startingPrice: 14800,
  },
  {
    id: 'route-jfk-lax',
    fromCity: 'New York',
    fromCode: 'JFK',
    toCity: 'Los Angeles',
    toCode: 'LAX',
    duration: '5h 30m',
    startingPrice: 11200,
  },
  {
    id: 'route-dxb-lhr',
    fromCity: 'Dubai',
    fromCode: 'DXB',
    toCity: 'London',
    toCode: 'LHR',
    duration: '7h 10m',
    startingPrice: 16400,
  },
  {
    id: 'route-sin-dxb',
    fromCity: 'Singapore',
    fromCode: 'SIN',
    toCity: 'Dubai',
    toCode: 'DXB',
    duration: '7h 20m',
    startingPrice: 15900,
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How far in advance should I book?',
    answer:
      'On-demand charters can be dispatched with as little as 4 hours notice for domestic flights and 12 hours for international sectors. Jet Card members enjoy guaranteed availability within a 24-hour booking window year-round.',
  },
  {
    question: 'What is an empty leg?',
    answer:
      'When an aircraft flies one-way to pick up its next passengers or return to base, that repositioning sector becomes an Empty Leg. SkyElite publishes these verified routes at 40% to 55% below standard charter tariffs.',
  },
  {
    question: 'Can I bring pets?',
    answer:
      'Yes. Dogs and cats travel alongside you inside the main cabin at no additional fee. Simply note your pet’s breed and weight in your trip brief so our concierge prepares cabin mats and international health clearances if needed.',
  },
  {
    question: 'What is the baggage allowance?',
    answer:
      'Every aircraft class accommodates generous soft-sided luggage, garment bags, and sporting gear such as golf bags or ski cases. Midsize jets hold up to 127 cu ft, while Heavy and Ultra-Long-Range aircraft offer 195 cu ft of pressurized storage.',
  },
  {
    question: 'How does catering work?',
    answer:
      'Curated seasonal dining, fine wines, and barista espresso are tailored to your itinerary. Complimentary artisanal refreshments are stocked on every flight, and custom restaurant or dietary menus can be ordered up to 12 hours prior to departure.',
  },
  {
    question: 'What happens if my plans change?',
    answer:
      'We understand executive schedules shift. Departure times may be adjusted seamlessly with your flight coordinator, and Jet Card holders benefit from flexible cancellation terms up to 12 hours before wheels-up.',
  },
];
