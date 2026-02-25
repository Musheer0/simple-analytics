import mapValues from "lodash/mapValues";

export function convertBigInts(obj: Object) {
  return mapValues(obj, (val) => (typeof val === "bigint" ? Number(val) : val));
}
