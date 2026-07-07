import {
  formatDate,
  formatDateShort,
  formatTime,
  formatRelativeTime,
  formatMessageTime,
  getInitials,
  calculateAge,
} from '../../lib/formatters';

describe('formatDate', () => {
  it('formats a date string to "Weekday, Mon Day, Year"', () => {
    const result = formatDate('2026-01-05');
    expect(result).toBe('Mon, Jan 5, 2026');
  });

  it('formats another date correctly', () => {
    const result = formatDate('2025-12-25');
    expect(result).toBe('Thu, Dec 25, 2025');
  });

  it('formats a date at year boundary', () => {
    const result = formatDate('2026-12-31');
    expect(result).toBe('Thu, Dec 31, 2026');
  });
});

describe('formatDateShort', () => {
  it('returns short month and day', () => {
    expect(formatDateShort('2026-01-05')).toBe('Jan 5');
  });

  it('formats a different date', () => {
    expect(formatDateShort('2026-07-15')).toBe('Jul 15');
  });
});

describe('formatTime', () => {
  it('converts morning time to 12-hour format', () => {
    expect(formatTime('09:00')).toBe('9:00 AM');
  });

  it('converts noon to 12-hour format', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
  });

  it('converts afternoon time', () => {
    expect(formatTime('14:30')).toBe('2:30 PM');
  });

  it('converts midnight', () => {
    expect(formatTime('00:00')).toBe('12:00 AM');
  });

  it('handles HH:MM:SS format', () => {
    expect(formatTime('15:45:00')).toBe('3:45 PM');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-08T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "Just now" for less than a minute ago', () => {
    expect(formatRelativeTime('2026-07-08T11:59:30.000Z')).toBe('Just now');
  });

  it('returns minutes ago', () => {
    expect(formatRelativeTime('2026-07-08T11:55:00.000Z')).toBe('5m ago');
  });

  it('returns hours ago', () => {
    expect(formatRelativeTime('2026-07-08T09:00:00.000Z')).toBe('3h ago');
  });

  it('returns "Yesterday" for 1 day ago', () => {
    expect(formatRelativeTime('2026-07-07T12:00:00.000Z')).toBe('Yesterday');
  });

  it('returns days ago for 2-6 days', () => {
    expect(formatRelativeTime('2026-07-05T12:00:00.000Z')).toBe('3d ago');
  });

  it('returns formatted date for 7+ days ago', () => {
    const result = formatRelativeTime('2026-06-20T12:00:00.000Z');
    expect(result).toBe('Jun 20');
  });
});

describe('formatMessageTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-08T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns time only for today', () => {
    // Use a timestamp within today (accounting for local timezone conversion)
    const result = formatMessageTime('2026-07-08T10:30:00.000Z');
    // Should be a time string (contains AM or PM)
    expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
  });

  it('returns weekday + time for this week', () => {
    const result = formatMessageTime('2026-07-06T14:00:00.000Z');
    // Should contain a weekday abbreviation and a time
    expect(result).toMatch(/\w{3}\s+\d{1,2}:\d{2}\s*(AM|PM)/);
  });

  it('returns date for older messages', () => {
    const result = formatMessageTime('2026-06-01T10:00:00.000Z');
    expect(result).toBe('Jun 1');
  });
});

describe('getInitials', () => {
  it('returns first letter of a single name', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  it('returns first and last initials for two names', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns first and last initials for multiple names', () => {
    expect(getInitials('Mary Jane Watson')).toBe('MW');
  });

  it('returns "?" for empty string', () => {
    expect(getInitials('')).toBe('?');
  });

  it('returns "?" for null', () => {
    expect(getInitials(null)).toBe('?');
  });

  it('returns "?" for undefined', () => {
    expect(getInitials(undefined)).toBe('?');
  });

  it('handles names with extra whitespace', () => {
    expect(getInitials('  John   Doe  ')).toBe('JD');
  });
});

describe('calculateAge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-08T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns years for 2+ years', () => {
    expect(calculateAge('2024-01-01')).toBe('2 years');
  });

  it('returns "1 year" for exactly 1 year', () => {
    expect(calculateAge('2025-07-01')).toBe('1 year');
  });

  it('returns months for less than a year', () => {
    expect(calculateAge('2026-01-01')).toBe('6 months');
  });

  it('returns "1 month" for exactly 1 month', () => {
    expect(calculateAge('2026-06-01')).toBe('1 month');
  });

  it('returns weeks for less than a month', () => {
    expect(calculateAge('2026-06-20')).toBe('2 weeks');
  });

  it('returns days for less than a week', () => {
    expect(calculateAge('2026-07-05')).toBe('3 days');
  });
});
