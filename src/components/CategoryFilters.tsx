import { BuildingCategory, CATEGORY_INFO } from '@/data/buildings';

interface CategoryFiltersProps {
  categories: BuildingCategory[];
  selectedCategory: BuildingCategory | null;
  onSelect: (category: BuildingCategory | null) => void;
}

export default function CategoryFilters({ 
  categories, 
  selectedCategory, 
  onSelect 
}: CategoryFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
      >
        All
      </button>
      {categories.map(category => {
        const info = CATEGORY_INFO[category];
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
          >
            <span className="mr-1.5">{info.icon}</span>
            {info.label}
          </button>
        );
      })}
    </div>
  );
}
