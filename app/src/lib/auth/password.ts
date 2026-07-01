import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${key.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false;
  const [method, salt, hash] = storedHash.split(':');
  if (method !== 'scrypt' || !salt || !hash) return false;
  const key = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  const stored = Buffer.from(hash, 'hex');
  if (stored.length !== key.length) return false;
  return timingSafeEqual(stored, key);
}
