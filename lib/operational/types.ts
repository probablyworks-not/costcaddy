// Kept import-free of db/schema so client components (the attach form) can pull the
// vocabulary without dragging the Postgres driver into the browser bundle.
export const OPERATIONAL_FILE_TYPES = [
  'Bill Edit & Modification',
  'Non-chargeable',
  'Item Purchase Statement',
  'Stock Statement',
  'Item Cancellation',
  'Discounts',
] as const;

export type OperationalFileType = (typeof OPERATIONAL_FILE_TYPES)[number];
