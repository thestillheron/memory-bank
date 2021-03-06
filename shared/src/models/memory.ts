import { Significance } from './../constants/significance';
export interface Memory {
  id: string;
  title: string;
  content: string;
  significance: Significance;
  year?: string;
  month?: string;
  day?: string;
}
