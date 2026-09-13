// Ported verbatim from Super Admin Flow.dc.html's builderCatCode (A4). Single word ->
// first 3 letters uppercased; multi-word -> initials, truncated to 3.
export function builderCatCode(name: string | null | undefined): string {
  const words = String(name ?? '')
    .replace(/[^A-Za-z ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return 'CAT';
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

// Reference codes renumber on every change: catCode + '-' + zero-padded(index+1, 2).
export function checklistPointCode(catCode: string, indexInDepartment: number): string {
  return `${catCode}-${String(indexInDepartment + 1).padStart(2, '0')}`;
}
