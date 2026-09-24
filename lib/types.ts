/**
 * Domain model for the Region C site.
 *
 * These interfaces are the contract between content and presentation. Today the
 * records are supplied by the static modules in `data/`; a later migration to a
 * CMS or database only has to satisfy these shapes for the UI to keep working.
 */

/** US state (or territory) served by Region C. */
export interface RegionState {
  /** USPS two-letter code, used as the stable identifier. */
  code: string;
  name: string;
  slug: string;
  /** `confirmed` states are published; `pending` are shown as awaiting confirmation. */
  status: 'confirmed' | 'pending';
  /** Leadership id of the state supervisor, when one has been designated. */
  supervisorId?: string;
  summary?: string;
}

export interface Leader {
  id: string;
  /** Personal name without the ecclesiastical prefix. */
  name: string;
  /** Ecclesiastical title/abbreviation as it appears in official CCC usage. */
  ecclesiasticalTitle: string;
  /** Regional office held. */
  office: string;
  /** Path to a headshot within `public/`. Cards fall back to initials when absent. */
  image?: string;
  state?: string;
  parish?: string;
  bio?: string;
  /** Lower numbers appear first. */
  displayOrder: number;
  /** Principals are given visual prominence above the wider executive. */
  tier: 'principal' | 'executive';
  /** Grouping used for filtering and for ministry cross-references. */
  portfolio: LeadershipPortfolio;
  email?: string;
}

export type LeadershipPortfolio =
  | 'Regional Office'
  | 'Administration'
  | 'Evangelism'
  | 'Shepherding'
  | 'Women'
  | 'Youth'
  | 'Welfare'
  | 'Music';

export interface Parish {
  id: string;
  name: string;
  slug: string;
  /** USPS state code, matching `RegionState.code`. */
  state: string;
  /** Omitted when only the state is known; the parish is then shown by state alone. */
  city?: string;
  address?: string;
  shepherd?: string;
  phone?: string;
  email?: string;
  website?: string;
  /** Full URLs of the parish's social media accounts. */
  social?: ParishSocial;
  image?: string;
  latitude?: number;
  longitude?: number;
  serviceTimes?: ServiceTime[];
  description?: string;
  /** True while the record is illustrative sample content, not verified data. */
  isPlaceholder?: boolean;
}

export interface ParishSocial {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  x?: string;
  vimeo?: string;
  spotify?: string;
}

export interface ServiceTime {
  label: string;
  day: string;
  time: string;
}

export interface RegionEvent {
  id: string;
  title: string;
  slug: string;
  /** ISO 8601 date or date-time. */
  startDate: string;
  endDate?: string;
  /** Set when the event runs all day and no clock time should be rendered. */
  allDay?: boolean;
  location: string;
  parish?: string;
  state?: string;
  description: string;
  image?: string;
  registrationUrl?: string;
  category?: EventCategory;
  isPlaceholder?: boolean;
}

export type EventCategory =
  | 'Regional'
  | 'Evangelism'
  | 'Youth'
  | 'Women'
  | 'Choir & Music'
  | 'Convention'
  | 'Training'
  /** Annual parish Harvest Thanksgiving services. */
  | 'Harvest';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  /** ISO 8601 publication date. */
  date: string;
  author: string;
  image?: string;
  excerpt: string;
  /** Article body as an ordered list of paragraphs. */
  content: string[];
  category: NewsCategory;
  isPlaceholder?: boolean;
}

/**
 * An article on another Celestial Church of Christ news site.
 *
 * Deliberately not a `NewsArticle`: these are never republished here. Only a
 * headline, the source's own summary and a link out, so the reader ends up on
 * the publisher's page and nothing reads as a Region C statement.
 */
export interface ExternalArticle {
  id: string;
  title: string;
  /** The article on the publisher's own site. */
  url: string;
  /** ISO 8601 date, no time — these are only ever shown as a date. */
  date: string;
  excerpt: string;
  source: string;
  sourceUrl: string;
  scope: 'usa' | 'worldwide';
}

export type NewsCategory =
  | 'Region News'
  | 'Parish News'
  | 'Diocese'
  | 'Evangelism'
  | 'Youth'
  | 'Events';

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string[];
  /** Leadership ids of the officers who carry this portfolio. */
  leaderIds: string[];
  /** Short, concrete statements of what the ministry does. */
  focusAreas: string[];
  icon: MinistryIcon;
  displayOrder: number;
}

export type MinistryIcon = 'evangelism' | 'women' | 'youth' | 'welfare' | 'music' | 'general';

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  /** Internal path within `public/` or an absolute external URL. */
  href: string;
  /** ISO 8601 date the resource was issued or last revised. */
  date: string;
  fileType?: 'PDF' | 'DOC' | 'XLS' | 'Link' | 'Form';
  audience?: string[];
  /** True until the actual document has been supplied by the Secretariat. */
  isPlaceholder?: boolean;
}

export type ResourceCategory =
  | 'Forms'
  | 'Policies'
  | 'Official Notices'
  | 'Administration'
  | 'Training'
  | 'Technology'
  | 'Parish Support';
