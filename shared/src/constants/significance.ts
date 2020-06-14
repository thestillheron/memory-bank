export const VERY_LOW = "Very Low";
export const LOW = "Low";
export const MEDIUM = "Medium";
export const HIGH = "High";
export const VERY_HIGH = "Very High";

export const SIGNIFICANCE_LIST = [VERY_LOW, LOW, MEDIUM, HIGH, VERY_HIGH];
export type Significance =
  | typeof VERY_LOW
  | typeof LOW
  | typeof MEDIUM
  | typeof HIGH
  | typeof VERY_HIGH;
