import argon2 from 'argon2';
import { randomInt } from 'node:crypto';

export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export function verifyPassword(pwdHash: string, password: string): Promise<boolean> {
  return argon2.verify(pwdHash, password);
}

// Shown once at set/reset, then discarded — the hash is the only thing stored (CLAUDE.md "Auth").
const PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generatePassword(length = 14): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += PASSWORD_ALPHABET[randomInt(PASSWORD_ALPHABET.length)];
  }
  return out;
}
