import type { CountryId } from './types';
import { UK, type UKState } from './uk';
import { BE, type BEState } from './be';

export { UK, BE };
export type { UKState, BEState };

export const COUNTRY_IDS: CountryId[] = ['uk', 'be'];
export const COUNTRY_NAMES: Record<CountryId, string> = { uk: UK.name, be: BE.name };
