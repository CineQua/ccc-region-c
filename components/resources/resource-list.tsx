'use client';

import { useId, useMemo, useState } from 'react';
import type { Resource, ResourceCategory } from '@/lib/types';
import { isResourceAvailable } from '@/data/resources';
import { formatShortDate } from '@/lib/format';
import { Badge, EmptyState } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { IconDocument, IconExternal, IconSearch } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

/**
 * Searchable, category-filtered resource centre.
 *
 * A resource with no attached file renders as "document pending" rather than a
 * dead link, so the shelf can be published before every document exists.
 */
export function ResourceList({
  resources,
  categories,
}: {
  resources: Resource[];
  categories: ResourceCategory[];
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ResourceCategory | 'all'>('all');
  const searchId = useId();

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return resources.filter((resource) => {
      if (category !== 'all' && resource.category !== category) return false;
      if (!needle) return true;
      return `${resource.title} ${resource.description} ${resource.audience?.join(' ') ?? ''}`
        .toLowerCase()
        .includes(needle);
    });
  }, [resources, query, category]);

  return (
    <div>
      <div className="rounded-lg border border-celestial-100 bg-celestial-50/60 p-4 sm:p-5">
        <label htmlFor={searchId} className="mb-1.5 block text-sm font-medium text-celestial-800">
          Search resources
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
            placeholder="Form name, policy or keyword"
            autoComplete="off"
            className="min-h-11 w-full rounded-md border border-celestial-200 bg-white pr-3 pl-10 text-base text-celestial-900 placeholder:text-celestial-400 focus:border-celestial-400 focus:outline-none"
          />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-celestial-800" id="resource-filter-label">
            Filter by category
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="resource-filter-label">
            <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
              All
            </FilterChip>
            {categories.map((item) => (
              <FilterChip
                key={item}
                active={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-celestial-600">
        Showing <span className="font-semibold text-celestial-900">{results.length}</span> of{' '}
        {resources.length} resources
      </p>

      <div className="mt-4">
        {results.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {results.map((resource) => (
              <li key={resource.id}>
                <ResourceItem resource={resource} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No resources found"
            description="No resource matches that search. Try a broader keyword, or select a different category."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setCategory('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-9 rounded-full border px-3.5 text-sm font-medium transition-colors',
        active
          ? 'border-celestial-800 bg-celestial-800 text-white'
          : 'border-celestial-200 bg-white text-celestial-700 hover:border-celestial-300 hover:bg-white',
      )}
    >
      {children}
    </button>
  );
}

function ResourceItem({ resource }: { resource: Resource }) {
  const available = isResourceAvailable(resource);
  const isExternal = resource.href.startsWith('http');

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-celestial-50 text-celestial-700"
        >
          <IconDocument className="h-5 w-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-2">
          <Badge tone="neutral">{resource.category}</Badge>
          {resource.fileType ? <Badge tone="neutral">{resource.fileType}</Badge> : null}
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-celestial-900">{resource.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-celestial-700">{resource.description}</p>

      {resource.audience?.length ? (
        <p className="mt-3 text-xs text-celestial-500">For: {resource.audience.join(', ')}</p>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-celestial-100 pt-3">
        <span className="text-xs text-celestial-500">{formatShortDate(resource.date)}</span>
        {available ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-celestial-700">
            {isExternal ? 'Open link' : 'Download'}
            {isExternal ? <IconExternal className="h-3.5 w-3.5" /> : null}
          </span>
        ) : (
          <Badge tone="gold">Document pending</Badge>
        )}
      </div>
    </>
  );

  const shell =
    'flex h-full flex-col rounded-lg border border-celestial-100 bg-white p-5 shadow-card transition-shadow duration-200';

  if (!available) {
    return <div className={cn(shell, 'opacity-90')}>{body}</div>;
  }

  return (
    <a
      href={resource.href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : { download: true })}
      className={cn(shell, 'hover:border-celestial-200 hover:shadow-card-hover')}
    >
      {body}
    </a>
  );
}
