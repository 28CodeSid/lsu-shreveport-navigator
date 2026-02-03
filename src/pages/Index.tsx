import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import CampusMap from '@/components/CampusMap';
import SearchBar from '@/components/SearchBar';
import BuildingDetail from '@/components/BuildingDetail';
import CategoryFilters from '@/components/CategoryFilters';
import DirectionsPanel from '@/components/DirectionsPanel';
import LocateMeButton from '@/components/LocateMeButton';
import { 
  Building, 
  buildings, 
  BuildingCategory,
  CATEGORY_INFO 
} from '@/data/buildings';
import { Menu, List, Map as MapIcon } from 'lucide-react';
import BuildingList from '@/components/BuildingList';

type ViewMode = 'map' | 'list';

export default function Index() {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BuildingCategory | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [directionsMode, setDirectionsMode] = useState(false);
  const [directionsDestination, setDirectionsDestination] = useState<Building | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [showList, setShowList] = useState(false);

  // Get unique categories from buildings
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(buildings.map(b => b.category))];
    return uniqueCategories;
  }, []);

  // Filter buildings by category
  const filteredBuildings = useMemo(() => {
    if (!selectedCategory) return buildings;
    return buildings.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  // Handle building selection
  const handleBuildingSelect = useCallback((building: Building) => {
    setSelectedBuilding(building);
    setShowList(false);
  }, []);

  // Handle get directions
  const handleGetDirections = useCallback((building: Building) => {
    setDirectionsDestination(building);
    setDirectionsMode(true);
    setSelectedBuilding(null);
  }, []);

  // Close directions
  const handleCloseDirections = useCallback(() => {
    setDirectionsMode(false);
    setDirectionsDestination(null);
  }, []);

  // Handle location found
  const handleLocationFound = useCallback((coords: [number, number]) => {
    setUserLocation(coords);
    toast.success('Location found!');
  }, []);

  // Handle location error
  const handleLocationError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  // Calculate simple route (straight line for MVP)
  const route = useMemo(() => {
    if (!directionsMode || !directionsDestination) return undefined;
    
    const origin = userLocation || [32.4518, -93.7275] as [number, number]; // Default to campus center
    return [origin, directionsDestination.coordinates];
  }, [directionsMode, directionsDestination, userLocation]);

  // Calculate distance and duration
  const routeInfo = useMemo(() => {
    if (!route || route.length < 2) return { distance: undefined, duration: undefined };
    
    const [lat1, lon1] = route[0];
    const [lat2, lon2] = route[1];
    
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    const distanceStr = distance < 0.1 
      ? `${Math.round(distance * 5280)} ft`
      : `${distance.toFixed(2)} mi`;
    
    const walkingMinutes = Math.max(1, Math.round(distance * 20)); // ~3 mph walking
    const durationStr = `${walkingMinutes} min`;
    
    return { distance: distanceStr, duration: durationStr };
  }, [route]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Directions Panel (Top) */}
      {directionsMode && directionsDestination && (
        <DirectionsPanel
          origin={userLocation ? 'user' : buildings[0]}
          destination={directionsDestination}
          distance={routeInfo.distance}
          duration={routeInfo.duration}
          onClose={handleCloseDirections}
          onSwap={() => {}}
        />
      )}

      {/* Map */}
      <div className="absolute inset-0">
        <CampusMap
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingSelect}
          route={route}
          userLocation={userLocation}
        />
      </div>

      {/* Top UI Overlay */}
      <div className={`absolute top-0 left-0 right-0 p-4 pointer-events-none z-30 ${
        directionsMode ? 'pt-44' : ''
      }`}>
        <div className="max-w-xl mx-auto pointer-events-auto">
          {/* Search Bar */}
          <div className="mb-3">
            <SearchBar onSelect={handleBuildingSelect} />
          </div>

          {/* Category Filters */}
          <CategoryFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Header Badge */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 bg-card/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-card pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LS</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight">LSUS Navigator</h1>
            <p className="text-[10px] text-muted-foreground">Louisiana State University Shreveport</p>
          </div>
        </div>
      </div>

      {/* FAB Buttons */}
      <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-3">
        {/* List Toggle */}
        <button
          onClick={() => setShowList(!showList)}
          className="w-12 h-12 rounded-full bg-card flex items-center justify-center shadow-card hover:shadow-card-hover transition-all"
        >
          {showList ? <MapIcon className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
        
        {/* Locate Me */}
        <LocateMeButton
          onLocationFound={handleLocationFound}
          onError={handleLocationError}
        />
      </div>

      {/* Building List Sidebar */}
      {showList && (
        <div className="absolute top-32 bottom-24 left-4 w-80 bg-card rounded-2xl shadow-elevated z-20 overflow-hidden animate-scale-in">
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-bold">
              {selectedCategory ? CATEGORY_INFO[selectedCategory].label : 'All Buildings'}
            </h2>
            <p className="text-xs text-muted-foreground">{filteredBuildings.length} locations</p>
          </div>
          <div className="h-full overflow-y-auto p-3 pb-20">
            <BuildingList
              buildings={filteredBuildings}
              selectedId={selectedBuilding?.id}
              onSelect={handleBuildingSelect}
            />
          </div>
        </div>
      )}

      {/* Building Detail Sheet */}
      {selectedBuilding && !directionsMode && (
        <BuildingDetail
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onGetDirections={handleGetDirections}
          userLocation={userLocation}
        />
      )}
    </div>
  );
}
