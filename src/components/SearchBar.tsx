import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Building, searchBuildings, CATEGORY_INFO } from '@/data/buildings';

interface SearchBarProps {
  onSelect: (building: Building) => void;
  placeholder?: string;
}

export default function SearchBar({ onSelect, placeholder = 'Search buildings, departments...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Building[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchBuildings(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setFocusedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (building: Building) => {
    onSelect(building);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelect(results[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl overflow-hidden z-50 animate-scale-in"
          style={{ boxShadow: 'var(--shadow-lg)' }}
        >
          <div className="max-h-80 overflow-y-auto">
            {results.map((building, index) => {
              const categoryInfo = CATEGORY_INFO[building.category];
              return (
                <button
                  key={building.id}
                  onClick={() => handleSelect(building)}
                  className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                    focusedIndex === index ? 'bg-secondary' : 'hover:bg-secondary/50'
                  }`}
                >
                  <span className="text-xl mt-0.5">{categoryInfo?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{building.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {categoryInfo?.label}
                      {building.departments?.length ? ` • ${building.departments[0]}` : ''}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
