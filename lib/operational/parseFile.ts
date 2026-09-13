import ExcelJS from 'exceljs';

export type OperationalFileFormat = 'Excel' | 'CSV' | 'PDF' | 'Image';

export type ParsedOperationalFile = {
  format: OperationalFileFormat;
  parseStatus: 'parsed' | 'unreadable';
  coverageSummary: string | null;
};

function detectFormat(filename: string, mimeType: string): OperationalFileFormat {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType === 'application/pdf' || ext === 'pdf') return 'PDF';
  if (ext === 'csv') return 'CSV';
  return 'Excel';
}

// C1 — attempts to actually read Excel/CSV so the review screen can say whether the
// file parsed, not just that it uploaded. PDF/image have no OCR adapter yet (EXECUTION.md
// "Not yet designed" — per-client operational-file import adapters), so they're stored
// as 'unreadable' rather than faking a read.
export async function parseOperationalFile(filename: string, mimeType: string, bytes: ArrayBuffer): Promise<ParsedOperationalFile> {
  const format = detectFormat(filename, mimeType);

  if (format === 'PDF' || format === 'Image') {
    return { format, parseStatus: 'unreadable', coverageSummary: null };
  }

  if (format === 'CSV') {
    try {
      const text = Buffer.from(bytes).toString('utf-8');
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '');
      if (lines.length === 0) throw new Error('Empty file');
      const cols = lines[0].split(',').length;
      return {
        format,
        parseStatus: 'parsed',
        coverageSummary: `${lines.length - 1} rows · ${cols} columns`,
      };
    } catch {
      return { format, parseStatus: 'unreadable', coverageSummary: null };
    }
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(bytes);
    const sheet = workbook.worksheets[0];
    if (!sheet) throw new Error('No worksheet');
    return {
      format,
      parseStatus: 'parsed',
      coverageSummary: `"${sheet.name}" · ${Math.max(sheet.rowCount - 1, 0)} rows`,
    };
  } catch {
    return { format, parseStatus: 'unreadable', coverageSummary: null };
  }
}
