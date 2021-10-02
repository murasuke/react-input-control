export const ControlType = {
  NUMBER: 'NUMBER',
  DATE: 'DATE',
  TEXT: 'TEXT',
  RADIO: 'RADIO',
  COMBO: 'COMBO',
} as const;

export type ValueOf<T> = T[keyof T];
export type Nullable<T> = T | null;

export type DataType = { type: ValueOf<typeof ControlType>; value: number | null; text: string };

export type setValueCallback = (id: string, data: DataType) => void;
export const defaultSetValue: setValueCallback = (id, data) => {};
