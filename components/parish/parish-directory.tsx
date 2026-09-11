'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { ParishCard } from './parish-card';
import type { Parish, RegionState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/primitives';
import { IconSearch } from '@/components/ui/icons';
import { pluralise } from '@/lib/format';

/**
 * Client-side parish search and filtering.
 *
 * Filtering runs in the browser over the full directory. That is the right
 * trade-off while the directory is measured in dozens of parishes: results are
 * instant, there is no request per keystroke, and the markup is server-rendered
 * for search engines. If the directory ever grows into the thousands, swap the
 * `useMemo` for a server action without changing this component's props.
 */
export function ParishDirectory({
  parishes,
  states,
  /** Preselects a state, e.g. when reached from a state page. */
  initialState = 'all',
}: {
  parishes: Parish[];
  states: RegionState[];
  initialState?: string;
}) {
  const [query, setQuery] = useState('');
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCity, setSelectedCity] = useState('all');

  const searchId = useId();
  const stateId = useId();
  const cityId = useId();

  // Keeps typing responsive by letting the list render lag the input by a frame.
  const deferredQuery = useDeferredValue(query);

  // Cities depend on the chosen state, so the two selects stay consistent.
  const cities = useMemo(() => {
    const scope =
      selectedState === 'all' ? parishes : parishes.filter((p) => p.state === selectedState);
    return [...new Set(scope.flatMap((p) => (p.city ? [p.city] : [])))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [parishes, selectedState]);

  const results = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return parishes.filter((parish) => {
      if (selectedState !== 'all' && parish.state !== selectedState) return false;
      if (selectedCity !== 'all' && parish.city !== selectedCity) return false;
      if (!needle) return true;
      return [parish.name, parish.city, parish.address, parish.shepherd]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle));
    });
  }, [parishes, deferredQuery, selectedState, selectedCity]);

  const isFiltered = query.trim() !== '' || selectedState !== 'all' || selectedCity !== 'all';

  const reset = () => {
    setQuery('');
    setSelectedState('all');
    setSelectedCity('all');
  };

  const onStateChange = (value: string) => {
    setSelectedState(value);
    // A city from the previous state would produce an empty result set.
    setSelectedCity('all');
  };

  return (
    <div>
      <div className="rounded-lg border border-celestial-100 bg-celestial-50/60 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <label htmlFor={searchId} className="mb-1.5 block text-sm font-medium text-celestial-800">
              Search parishes
            </label>
            <div className="relative">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-celestial-400"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Parish name or city"
                autoComplete="off"
                className="min-h-11 w-full rounded-md border border-celestial-200 bg-white pr-3 pl-10 text-base text-celestial-900 placeholder:text-celestial-400 focus:border-celestial-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor={stateId} className="mb-1.5 block text-sm font-medium text-celestial-800">
              State
            </label>
            <select
              id={stateId}
              value={selectedState}
              onChange={(event) => onStateChange(event.target.value)}
              className="min-h-11 w-full rounded-md border border-celestial-200 bg-white px-3 text-base text-celestial-900 focus:border-celestial-400 focus:outline-none"
            >
              <option value="all">All states</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={cityId} className="mb-1.5 block text-sm font-medium text-celestial-800">
              City
            </label>
            <select
              id={cityId}
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="min-h-11 w-full rounded-md border border-celestial-200 bg-white px-3 text-base text-celestial-900 focus:border-celestial-400 focus:outline-none"
            >
              <option value="all">All cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/* Announced politely so screen-reader users hear the result count change. */}
        <p aria-live="polite" className="text-sm text-celestial-600">
          Showing <span className="font-semibold text-celestial-900">{results.length}</span>{' '}
          {pluralise(results.length, 'parish', 'parishes')}
          {isFiltered ? ' matching your search' : ''}
        </p>
        {isFiltered ? (
          <Button variant="secondary" size="sm" onClick={reset}>
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mt-4">
        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((parish) => (
              <ParishCard key={parish.id} parish={parish} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No parishes match your search"
            description="Try a different spelling, widen the state or city filter, or clear the filters to see the full Region C directory."
            action={
              <Button variant="secondary" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
