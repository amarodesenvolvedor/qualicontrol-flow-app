
export interface DataItem {
  name: string;
  value: number;
  id?: string[];
  color?: string;
  descriptions?: string[];
  percentage?: number;
  [key: string]: any;
}
