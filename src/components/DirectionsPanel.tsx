import { Building, CATEGORY_INFO } from '@/data/buildings';
import { MapPin, X, Navigation2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DirectionsPanelProps {
  origin: Building | 'user';
  destination: Building;
  distance?: string;
  duration?: string;
  onClose: () => void;
  onSwap: () => void;
}

export default function DirectionsPanel({
  origin,
  destination,
  distance,
  duration,
  onClose,
  onSwap,
}: DirectionsPanelProps) {
  const destInfo = CATEGORY_INFO[destination.category];

  return (
    <div className="fixed top-0 left-0 right-0 bg-card z-40 animate-slide-down" style={{ boxShadow: 'var(--shadow-lg)' }}>
      <div className="p-4 safe-area-inset-top">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Directions</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Points */}
        <div className="flex items-stretch gap-3">
          {/* Timeline */}
          <div className="flex flex-col items-center py-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="flex-1 w-0.5 bg-border my-1" />
            <div className="w-3 h-3 rounded-full bg-accent" />
          </div>

          {/* Locations */}
          <div className="flex-1 space-y-3">
            {/* Origin */}
            <div className="bg-secondary/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">From</p>
              <p className="font-medium text-sm">
                {origin === 'user' ? 'Your Location' : origin.name}
              </p>
            </div>

            {/* Destination */}
            <div className="bg-secondary/50 rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">To</p>
              <div className="flex items-center gap-2">
                <span>{destInfo?.icon}</span>
                <p className="font-medium text-sm">{destination.name}</p>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={onSwap}
            className="self-center p-2 rounded-full hover:bg-secondary transition-colors"
            title="Swap origin and destination"
          >
            <Navigation2 className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Route Info */}
        {(distance || duration) && (
          <div className="flex items-center justify-center gap-4 mt-4 py-3 bg-primary/5 rounded-xl">
            {distance && (
              <div className="text-center">
                <p className="text-xl font-display font-bold text-primary">{distance}</p>
                <p className="text-xs text-muted-foreground">Distance</p>
              </div>
            )}
            {distance && duration && <div className="w-px h-8 bg-border" />}
            {duration && (
              <div className="text-center">
                <p className="text-xl font-display font-bold text-primary">{duration}</p>
                <p className="text-xs text-muted-foreground">Walking</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
