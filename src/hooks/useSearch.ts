import { useState, useEffect, useMemo } from 'react';

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  initialQuery = ''
) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return items;
    const lowerQuery = debouncedQuery.toLowerCase();
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === 'number') {
          return value.toString().includes(lowerQuery);
        }
        return false;
      })
    );
  }, [items, searchFields, debouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
    filteredItems,
  };
}
