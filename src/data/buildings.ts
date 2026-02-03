export type BuildingCategory = 
  | 'academic'
  | 'administrative'
  | 'athletics'
  | 'dining'
  | 'library'
  | 'parking'
  | 'residence'
  | 'student-services'
  | 'health';

export interface Building {
  id: string;
  name: string;
  shortName: string;
  category: BuildingCategory;
  description: string;
  coordinates: [number, number]; // [lat, lng]
  amenities: string[];
  hours?: string;
  address?: string;
  departments?: string[];
  image?: string;
}

export interface PathNode {
  id: string;
  coordinates: [number, number];
  connectedTo: string[];
}

// LSUS Campus Center: approximately 32.4518, -93.7275
export const CAMPUS_CENTER: [number, number] = [32.4518, -93.7275];
export const DEFAULT_ZOOM = 17;

export const CATEGORY_INFO: Record<BuildingCategory, { label: string; icon: string; color: string }> = {
  academic: { label: 'Academic', icon: '🎓', color: 'primary' },
  administrative: { label: 'Administrative', icon: '🏛️', color: 'muted' },
  athletics: { label: 'Athletics', icon: '🏃', color: 'success' },
  dining: { label: 'Dining', icon: '🍽️', color: 'warning' },
  library: { label: 'Library', icon: '📚', color: 'accent' },
  parking: { label: 'Parking', icon: '🅿️', color: 'muted' },
  residence: { label: 'Residence', icon: '🏠', color: 'secondary' },
  'student-services': { label: 'Student Services', icon: '👥', color: 'primary' },
  health: { label: 'Health', icon: '🏥', color: 'destructive' },
};

// LSUS Buildings Data
export const buildings: Building[] = [
  {
    id: 'administration',
    name: 'Administration Building',
    shortName: 'Admin',
    category: 'administrative',
    description: 'Main administrative offices including the Chancellor\'s office, Admissions, Financial Aid, and Registrar.',
    coordinates: [32.4525, -93.7268],
    amenities: ['Restrooms', 'Accessible Entrance', 'ATM'],
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    departments: ['Admissions', 'Financial Aid', 'Registrar', 'Chancellor\'s Office'],
  },
  {
    id: 'bronson-hall',
    name: 'Bronson Hall',
    shortName: 'Bronson',
    category: 'academic',
    description: 'Home to the College of Sciences with laboratories and lecture halls for Biology, Chemistry, and Physics.',
    coordinates: [32.4520, -93.7260],
    amenities: ['Labs', 'Study Rooms', 'Restrooms', 'Vending'],
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM',
    departments: ['Biology', 'Chemistry', 'Physics'],
  },
  {
    id: 'business-education',
    name: 'Business Education Building',
    shortName: 'BE',
    category: 'academic',
    description: 'College of Business featuring classrooms, computer labs, and faculty offices.',
    coordinates: [32.4515, -93.7280],
    amenities: ['Computer Labs', 'Study Areas', 'Restrooms'],
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM',
    departments: ['Accounting', 'Management', 'Marketing', 'Finance'],
  },
  {
    id: 'technology-center',
    name: 'Technology Center',
    shortName: 'Tech',
    category: 'academic',
    description: 'State-of-the-art facility housing Computer Science, Engineering, and IT programs.',
    coordinates: [32.4510, -93.7265],
    amenities: ['Computer Labs', 'Maker Space', 'Study Rooms', 'Restrooms'],
    hours: 'Mon-Fri: 7:00 AM - 11:00 PM, Sat: 9:00 AM - 5:00 PM',
    departments: ['Computer Science', 'Engineering', 'Information Technology'],
  },
  {
    id: 'noel-memorial-library',
    name: 'Noel Memorial Library',
    shortName: 'Library',
    category: 'library',
    description: 'The main campus library with extensive collections, study spaces, and research assistance.',
    coordinates: [32.4522, -93.7275],
    amenities: ['Study Rooms', 'Computers', 'Printing', 'Coffee Shop', 'Quiet Zones'],
    hours: 'Mon-Thu: 7:30 AM - 11:00 PM, Fri: 7:30 AM - 5:00 PM, Sat-Sun: 1:00 PM - 9:00 PM',
  },
  {
    id: 'university-center',
    name: 'University Center',
    shortName: 'UC',
    category: 'student-services',
    description: 'The hub of student life with dining, bookstore, student organizations, and event spaces.',
    coordinates: [32.4518, -93.7282],
    amenities: ['Food Court', 'Bookstore', 'Meeting Rooms', 'ATM', 'Restrooms'],
    hours: 'Mon-Fri: 7:00 AM - 9:00 PM, Sat: 10:00 AM - 4:00 PM',
  },
  {
    id: 'pilots-cafe',
    name: "Pilot's Café",
    shortName: 'Café',
    category: 'dining',
    description: 'Main campus dining facility offering a variety of meal options and grab-and-go items.',
    coordinates: [32.4517, -93.7285],
    amenities: ['Seating', 'Meal Plans Accepted', 'Vegetarian Options'],
    hours: 'Mon-Fri: 7:00 AM - 7:00 PM, Sat: 11:00 AM - 2:00 PM',
  },
  {
    id: 'health-pe-complex',
    name: 'Health & Physical Education Complex',
    shortName: 'HPE',
    category: 'athletics',
    description: 'Athletic facilities including gymnasium, fitness center, and athletic offices.',
    coordinates: [32.4508, -93.7290],
    amenities: ['Gym', 'Fitness Center', 'Locker Rooms', 'Basketball Courts'],
    hours: 'Mon-Fri: 6:00 AM - 10:00 PM, Sat: 8:00 AM - 6:00 PM',
  },
  {
    id: 'science-building',
    name: 'Science Building',
    shortName: 'Science',
    category: 'academic',
    description: 'Additional science classrooms and laboratories supporting STEM programs.',
    coordinates: [32.4528, -93.7258],
    amenities: ['Labs', 'Lecture Halls', 'Restrooms'],
    hours: 'Mon-Fri: 7:00 AM - 10:00 PM',
    departments: ['Mathematics', 'Environmental Science'],
  },
  {
    id: 'performing-arts',
    name: 'Performing Arts Center',
    shortName: 'PAC',
    category: 'academic',
    description: 'Home to Music, Theatre, and Fine Arts with performance venues and practice rooms.',
    coordinates: [32.4530, -93.7278],
    amenities: ['Theatre', 'Practice Rooms', 'Gallery', 'Box Office'],
    hours: 'Mon-Fri: 8:00 AM - 10:00 PM',
    departments: ['Music', 'Theatre', 'Fine Arts'],
  },
  {
    id: 'student-success-center',
    name: 'Student Success Center',
    shortName: 'SSC',
    category: 'student-services',
    description: 'Academic support services including tutoring, advising, and career counseling.',
    coordinates: [32.4512, -93.7272],
    amenities: ['Tutoring', 'Computer Access', 'Advising Offices', 'Testing Center'],
    hours: 'Mon-Fri: 8:00 AM - 6:00 PM',
  },
  {
    id: 'health-clinic',
    name: 'Student Health Clinic',
    shortName: 'Health',
    category: 'health',
    description: 'On-campus health services for students including basic medical care and wellness resources.',
    coordinates: [32.4505, -93.7278],
    amenities: ['Medical Services', 'Counseling', 'Wellness Programs'],
    hours: 'Mon-Fri: 8:00 AM - 4:30 PM',
  },
  {
    id: 'lot-a',
    name: 'Parking Lot A',
    shortName: 'Lot A',
    category: 'parking',
    description: 'Main student parking lot near the University Center.',
    coordinates: [32.4502, -93.7285],
    amenities: ['Accessible Spaces', 'Motorcycle Parking'],
  },
  {
    id: 'lot-b',
    name: 'Parking Lot B',
    shortName: 'Lot B',
    category: 'parking',
    description: 'Parking lot near academic buildings.',
    coordinates: [32.4535, -93.7265],
    amenities: ['Accessible Spaces'],
  },
  {
    id: 'pilot-field',
    name: 'Pilot Field',
    shortName: 'Field',
    category: 'athletics',
    description: 'Outdoor athletic field for intramural sports and recreation.',
    coordinates: [32.4498, -93.7295],
    amenities: ['Bleachers', 'Restrooms', 'Water Fountains'],
  },
];

// Simplified path network for routing
export const pathNodes: PathNode[] = [
  { id: 'node-1', coordinates: [32.4525, -93.7268], connectedTo: ['node-2', 'node-5'] },
  { id: 'node-2', coordinates: [32.4520, -93.7268], connectedTo: ['node-1', 'node-3', 'node-6'] },
  { id: 'node-3', coordinates: [32.4518, -93.7275], connectedTo: ['node-2', 'node-4', 'node-7'] },
  { id: 'node-4', coordinates: [32.4518, -93.7282], connectedTo: ['node-3', 'node-8'] },
  { id: 'node-5', coordinates: [32.4528, -93.7260], connectedTo: ['node-1', 'node-6'] },
  { id: 'node-6', coordinates: [32.4520, -93.7260], connectedTo: ['node-2', 'node-5'] },
  { id: 'node-7', coordinates: [32.4512, -93.7275], connectedTo: ['node-3', 'node-8', 'node-9'] },
  { id: 'node-8', coordinates: [32.4510, -93.7282], connectedTo: ['node-4', 'node-7'] },
  { id: 'node-9', coordinates: [32.4505, -93.7278], connectedTo: ['node-7', 'node-10'] },
  { id: 'node-10', coordinates: [32.4502, -93.7285], connectedTo: ['node-9'] },
];

export function getBuildingById(id: string): Building | undefined {
  return buildings.find(b => b.id === id);
}

export function getBuildingsByCategory(category: BuildingCategory): Building[] {
  return buildings.filter(b => b.category === category);
}

export function searchBuildings(query: string): Building[] {
  const lowercaseQuery = query.toLowerCase();
  return buildings.filter(b => 
    b.name.toLowerCase().includes(lowercaseQuery) ||
    b.shortName.toLowerCase().includes(lowercaseQuery) ||
    b.description.toLowerCase().includes(lowercaseQuery) ||
    b.departments?.some(d => d.toLowerCase().includes(lowercaseQuery)) ||
    b.amenities.some(a => a.toLowerCase().includes(lowercaseQuery))
  );
}
