import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { parseOperationalFile } from './parseFile';

async function makeXlsx(): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Bills');
  sheet.addRow(['Bill No', 'Amount']);
  sheet.addRow(['1001', '450']);
  sheet.addRow(['1002', '620']);
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer instanceof ArrayBuffer ? buffer : Uint8Array.from(buffer as Buffer).buffer;
}

describe('parseOperationalFile', () => {
  it('parses a valid CSV and reports row/column counts', async () => {
    const bytes = new TextEncoder().encode('a,b,c\n1,2,3\n4,5,6').buffer;
    const result = await parseOperationalFile('discounts.csv', 'text/csv', bytes);
    expect(result).toEqual({ format: 'CSV', parseStatus: 'parsed', coverageSummary: '2 rows · 3 columns' });
  });

  it('marks an empty CSV as unreadable', async () => {
    const bytes = new TextEncoder().encode('').buffer;
    const result = await parseOperationalFile('empty.csv', 'text/csv', bytes);
    expect(result.parseStatus).toBe('unreadable');
  });

  it('parses a valid Excel workbook', async () => {
    const bytes = await makeXlsx();
    const result = await parseOperationalFile('bills.xlsx', 'application/vnd.ms-excel', bytes);
    expect(result.format).toBe('Excel');
    expect(result.parseStatus).toBe('parsed');
    expect(result.coverageSummary).toContain('Bills');
  });

  it('marks a corrupt Excel file as unreadable rather than throwing', async () => {
    const bytes = new TextEncoder().encode('not a real workbook').buffer;
    const result = await parseOperationalFile('bad.xlsx', 'application/vnd.ms-excel', bytes);
    expect(result).toEqual({ format: 'Excel', parseStatus: 'unreadable', coverageSummary: null });
  });

  it('never attempts to parse PDF or image — no OCR adapter exists yet', async () => {
    const bytes = new ArrayBuffer(0);
    expect(await parseOperationalFile('scan.pdf', 'application/pdf', bytes)).toEqual({
      format: 'PDF',
      parseStatus: 'unreadable',
      coverageSummary: null,
    });
    expect(await parseOperationalFile('photo.jpg', 'image/jpeg', bytes)).toEqual({
      format: 'Image',
      parseStatus: 'unreadable',
      coverageSummary: null,
    });
  });
});
