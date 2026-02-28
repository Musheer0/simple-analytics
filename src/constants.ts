export const TTL = {
  MIN_30: 60 * 30,
  HOUR_1: 60 * 60,
  HOUR_6: 60 * 60 * 6,
  DAY_1: 60 * 60 * 24,
  WEEK_1: 60 * 60 * 24 * 7,
} as const;
export const ANALYTICS_TIME = {
  ONE_DAY:'24 hours',
  ONE_WEEK:'7 days',
  ONE_MONTH:'1 month',
  THREE_MONTHS:'3 months',
  ONE_YEAR:'1 year',
  TWO_YEAR:'2 years',
} as const;
export const ANALYTICS_TIME_MS = {
  ONE_DAY:1000*60*60*24,
  ONE_WEEK:1000*60*60*24*7,
  ONE_MONTH:1000*60*60*24*30,
  THREE_MONTHS:1000*60*60*24*30*3,
  ONE_YEAR:1000*60*60*24*30*12,
  TWO_YEAR:1000*60*60*24*30*24,
} as const;