import { parseNotes, formatVetNotes, formatOwnerNotes } from '../../lib/notesHelper';

describe('parseNotes', () => {
  it('returns empty owner and vet for null input', () => {
    expect(parseNotes(null)).toEqual({ owner: '', vet: '' });
  });

  it('returns empty owner and vet for empty string', () => {
    expect(parseNotes('')).toEqual({ owner: '', vet: '' });
  });

  it('parses valid JSON with both fields', () => {
    const raw = JSON.stringify({ owner: 'Limping on left leg', vet: 'Mild sprain' });
    expect(parseNotes(raw)).toEqual({ owner: 'Limping on left leg', vet: 'Mild sprain' });
  });

  it('parses JSON with only owner field', () => {
    const raw = JSON.stringify({ owner: 'Annual checkup' });
    expect(parseNotes(raw)).toEqual({ owner: 'Annual checkup', vet: '' });
  });

  it('parses JSON with only vet field', () => {
    const raw = JSON.stringify({ vet: 'Prescribed antibiotics' });
    expect(parseNotes(raw)).toEqual({ owner: '', vet: 'Prescribed antibiotics' });
  });

  it('treats plain text as legacy owner notes', () => {
    expect(parseNotes('My dog is not eating')).toEqual({
      owner: 'My dog is not eating',
      vet: '',
    });
  });

  it('treats malformed JSON as legacy owner notes', () => {
    expect(parseNotes('{broken json')).toEqual({
      owner: '{broken json',
      vet: '',
    });
  });
});

describe('formatOwnerNotes', () => {
  it('wraps owner notes in JSON with empty vet field', () => {
    const result = formatOwnerNotes('Vaccination needed');
    expect(JSON.parse(result)).toEqual({ owner: 'Vaccination needed', vet: '' });
  });

  it('handles empty string', () => {
    const result = formatOwnerNotes('');
    expect(JSON.parse(result)).toEqual({ owner: '', vet: '' });
  });
});

describe('formatVetNotes', () => {
  it('preserves existing owner notes while adding vet notes', () => {
    const existing = JSON.stringify({ owner: 'Not eating well', vet: '' });
    const result = formatVetNotes(existing, 'Possible gastritis');
    expect(JSON.parse(result)).toEqual({
      owner: 'Not eating well',
      vet: 'Possible gastritis',
    });
  });

  it('handles null existing notes', () => {
    const result = formatVetNotes(null, 'Healthy checkup');
    expect(JSON.parse(result)).toEqual({ owner: '', vet: 'Healthy checkup' });
  });

  it('handles legacy plain-text existing notes', () => {
    const result = formatVetNotes('Old plain note', 'New vet diagnosis');
    expect(JSON.parse(result)).toEqual({
      owner: 'Old plain note',
      vet: 'New vet diagnosis',
    });
  });

  it('overwrites existing vet notes', () => {
    const existing = JSON.stringify({ owner: 'Coughing', vet: 'Old diagnosis' });
    const result = formatVetNotes(existing, 'Updated diagnosis');
    expect(JSON.parse(result)).toEqual({
      owner: 'Coughing',
      vet: 'Updated diagnosis',
    });
  });
});
