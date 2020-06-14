import { Significance, SIGNIFICANCE_LIST } from "./../constants/significance";
import moment from "moment";

export interface NewMemoryTag {
  id?: string;
  name: string;
}

export interface NewMemoryPerson {
  id?: string;
  name: string;
}

export interface NewMemory {
  title: string;
  content: string;
  significance: Significance;
  year?: string;
  month?: string;
  day?: string;
  tags: NewMemoryTag[];
  people: NewMemoryPerson[];
}

export const validateNewMemory = (
  request: NewMemory,
  required: boolean = true
) => {
  const errors: string[] = [];
  if (!request && required) {
    errors.push("Memory is required");
    return errors;
  }
  if (!request.title) {
    errors.push("A title is required");
  }
  if (!request.content) {
    errors.push("Memory content is required");
  }
  if (request.day && !(request.month && request.year)) {
    errors.push("If day is provided, month and year must be provided");
  } else if (request.day) {
    if (
      !moment(
        `${request.year}-${request.month}-${request.day}`,
        `YYYY-MM-DD`
      ).isValid()
    ) {
      errors.push("The date given is invalid");
    }
  }

  if (request.month && !request.year) {
    errors.push("If month is provided, year must be provided");
  } else if (request.month) {
    if (!moment(`${request.year}-${request.month}`, `YYYY-MM`).isValid()) {
      errors.push("The date given is invalid");
    }
  }

  if (request.year) {
    if (!moment(`${request.year}`, `YYYY`).isValid()) {
      errors.push("The date given is invalid");
    }
  }

  if (!request.significance) {
    errors.push("Please select a level of significance");
  }

  if (!SIGNIFICANCE_LIST.includes(request.significance)) {
    errors.push("Please select a valid level of significance");
  }

  return errors;
};
