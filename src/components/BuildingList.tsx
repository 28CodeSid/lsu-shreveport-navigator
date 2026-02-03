import { Building, CATEGORY_INFO } from '@/data/buildings';
import { ChevronRight } from 'lucide-react';

interface BuildingListProps {
  buildings: Building[];
  selectedId?: string | null;
  onSelect: (building: Building) => void;
}

export default function BuildingList({ buildings, selectedId, onSelect }: BuildingListProps) {
  if (buildings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No buildings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {buildings.map(building => {
        const info = CATEGORY_INFO[building.category];
        const isSelected = selectedId === building.id;
        
        return (
          <button
            key={building.id}
            onClick={() => onSelect(building)}
            className={`building-card w-full text-left flex items-center gap-3 ${
              isSelected ? 'selected' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-lg flex-shrink-0">
              {info?.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{building.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {info?.label}
                {building.hours && ` • ${building.hours.split(',')[0]}`}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
