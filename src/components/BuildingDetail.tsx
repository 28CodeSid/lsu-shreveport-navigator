import { Building, CATEGORY_INFO } from '@/data/buildings';
import { X, Clock, MapPin, Navigation, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BuildingDetailProps {
  building: Building;
  onClose: () => void;
  onGetDirections: (building: Building) => void;
  userLocation?: [number, number] | null;
}

export default function BuildingDetail({ 
  building, 
  onClose, 
  onGetDirections,
  userLocation 
}: BuildingDetailProps) {
  const categoryInfo = CATEGORY_INFO[building.category];

  const calculateDistance = (): string | null => {
    if (!userLocation) return null;
    
    const R = 3959; // Earth's radius in miles
    const dLat = (building.coordinates[0] - userLocation[0]) * Math.PI / 180;
    const dLon = (building.coordinates[1] - userLocation[1]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation[0] * Math.PI / 180) * Math.cos(building.coordinates[0] * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 0.1) {
      return `${Math.round(distance * 5280)} ft`;
    }
    return `${distance.toFixed(2)} mi`;
  };

  const distance = calculateDistance();
  const walkingTime = distance ? Math.max(1, Math.round(parseFloat(distance) * (distance.includes('ft') ? 0.02 : 20))) : null;

  return (
    <div className="bottom-sheet animate-slide-up" style={{ maxHeight: '70vh' }}>
      <div className="bottom-sheet-handle" />
      
      <div className="px-5 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{categoryInfo?.icon}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                {categoryInfo?.label}
              </span>
            </div>
            <h2 className="text-xl font-display font-bold">{building.name}</h2>
            {building.shortName !== building.name && (
              <p className="text-sm text-muted-foreground">{building.shortName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Info */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {building.hours && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{building.hours.split(',')[0]}</span>
            </div>
          )}
          {distance && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{distance} away</span>
              {walkingTime && <span className="text-xs">• {walkingTime} min walk</span>}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {building.description}
        </p>

        {/* Departments */}
        {building.departments && building.departments.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.departments.map(dept => (
                <span key={dept} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {building.amenities.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {building.amenities.map(amenity => (
                <span key={amenity} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => onGetDirections(building)}
            className="flex-1 h-12 rounded-xl font-semibold"
            size="lg"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
          <Button
            variant="secondary"
            className="h-12 px-4 rounded-xl"
            size="lg"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
