import { Locate } from 'lucide-react';
import { useState, useCallback } from 'react';

interface LocateMeButtonProps {
  onLocationFound: (coords: [number, number]) => void;
  onError?: (error: string) => void;
}

export default function LocateMeButton({ onLocationFound, onError }: LocateMeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    if (!navigator.geolocation) {
      onError?.('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false);
        onLocationFound([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        setIsLoading(false);
        let message = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        onError?.(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [onLocationFound, onError]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="fab"
      title="Find my location"
    >
      <Locate className={`w-6 h-6 ${isLoading ? 'animate-pulse' : ''}`} />
    </button>
  );
}
