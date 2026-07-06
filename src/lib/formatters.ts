/**
 * Centralized date/time formatting utilities.
 */

/**
 * Format ISO date string to "Mon, Jan 5, 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format ISO date to short form: "Jan 5"
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format time string (HH:MM:SS or HH:MM) to 12-hour: "9:00 AM"
 */
export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Format ISO timestamp to relative time: "2m ago", "1h ago", "Yesterday"
 */
export function formatRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const date = new Date(isoTimestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format chat message timestamp: "10:30 AM" for today, "Mon 10:30 AM" for this week, "Jan 5" for older.
 */
export function formatMessageTime(isoTimestamp: string): string {
  const now = new Date();
  const date = new Date(isoTimestamp);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (diffDays === 0) return time;
  if (diffDays < 7) {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${day} ${time}`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Calculate age from birthdate string (ISO date).
 * Returns human-readable string like "2 years", "8 months", "3 weeks"
 */
export function calculateAge(birthdate: string): string {
  const birth = new Date(birthdate + 'T00:00:00');
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }
  if (now.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  if (years > 0) return years === 1 ? '1 year' : `${years} years`;
  if (months > 0) return months === 1 ? '1 month' : `${months} months`;

  const diffDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
  const weeks = Math.floor(diffDays / 7);
  if (weeks > 0) return weeks === 1 ? '1 week' : `${weeks} weeks`;
  return diffDays <= 1 ? '1 day' : `${diffDays} days`;
}

/**
 * Get user initials from name (max 2 chars).
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
