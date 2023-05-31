import crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

const KEY = process.env.ENC_KEY as string;
const GEN = process.env.GEN_KEY as string;
console.log({ GEN });

export function encryptData(data: string): string {
  console.log({ GEN });
  const iv = Buffer.from(GEN, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', KEY, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptData(encryptedData: string): any {
  const iv = Buffer.from(GEN, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', KEY, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  console.log({ decrypted });
  return decrypted;
}
