export interface NewMemory {
  title?: string;
  content?: string;
  year?: string;
  month?: string;
  day?: string;
  people: NewPerson[];
  tags: NewTag[];
}

export interface Memory extends NewMemory {
  id: string;
  title: string;
  people: Person[];
  tags: Tag[];
}

export interface NewPerson {
  name?: string;
}

export interface Person {
  id: string;
  name: string;
}

export interface NewTag {
  text?: string;
}

export interface Tag {
  id: string;
  text: string;
}
