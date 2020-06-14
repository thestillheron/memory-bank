import { Significance } from './../constants/significance';
import { Tag } from "./../models/tag";
import { Person } from "./../models/person";
export interface MemoryView {
  id: string;
  title: string;
  content: string;
  significance: Significance;
  year?: string;
  month?: string;
  day?: string;
  people: Person[];
  tags: Tag[];
}
