import { SportsInfoResponse } from '../types/sports-info.types';

/**
 * Sports Info Validators
 * 
 * Schema validation functions for Sports Info domain responses.
 */

/**
 * Validates Sports Info response
 */
export function validateSportsInfoResponse(body: unknown): asserts body is SportsInfoResponse {
  if (typeof body !== 'object' || body === null) {
    throw new Error('Invalid response: not an object');
  }

  const res = body as any;

  if (typeof res.statusCode !== 'number') throw new Error('Invalid statusCode');
  if (typeof res.message !== 'string') throw new Error('Invalid message');
  if (typeof res.timestamp !== 'string') throw new Error('Invalid timestamp');
  if (typeof res.path !== 'string') throw new Error('Invalid path');

  if (!res.data || typeof res.data !== 'object')
    throw new Error('Invalid data: missing or malformed');

  const sportsInfo = res.data.sportsInfo;
  if (!Array.isArray(sportsInfo))
    throw new Error('Invalid data: sportsInfo should be an array');

  for (const sport of sportsInfo) {
    if (typeof sport.id !== 'string') throw new Error('Invalid sport id');
    if (typeof sport.name !== 'string') throw new Error('Invalid sport name');
  }
}

