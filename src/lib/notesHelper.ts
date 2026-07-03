/**
 * Notes are stored in the `notes` column as a JSON string:
 * {"owner": "booking reason", "vet": "diagnosis/prescription"}
 *
 * For backward compatibility, if the notes field is a plain string
 * (from before this change), it's treated as owner notes.
 */

export interface AppointmentNotes {
  owner: string;
  vet: string;
}

export function parseNotes(raw: string | null): AppointmentNotes {
  if (!raw) return { owner: '', vet: '' };

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        owner: parsed.owner || '',
        vet: parsed.vet || '',
      };
    }
  } catch {
    // Not JSON — treat as legacy plain-text owner notes
  }

  return { owner: raw, vet: '' };
}

export function formatOwnerNotes(ownerNotes: string): string {
  return JSON.stringify({ owner: ownerNotes, vet: '' });
}

export function formatVetNotes(currentRaw: string | null, vetNotes: string): string {
  const current = parseNotes(currentRaw);
  return JSON.stringify({ owner: current.owner, vet: vetNotes });
}
