import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'lg';
}

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search movie...',
  size = 'sm',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-text-muted ${
          size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-border bg-bg-card pl-11 pr-10 text-text-primary placeholder-text-muted transition-all duration-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          size === 'lg' ? 'py-4 text-base' : 'py-2.5 text-sm'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
