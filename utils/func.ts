import * as dotenv from 'dotenv';
import { RAW, balanceType } from './interface.js';
import fs from 'fs';

dotenv.config();

export function readAddresses(): RAW[] {
  return JSON.parse(fs.readFileSync('./secret/address.json', 'utf8'));
}

export async function getBalance(addr: string) {
  try {
    const respons = await fetch(URL + `/addrs/${addr}/balance`);
    if (!respons) {
      throw new Error();
    }
    const data = (await respons.json()) as balanceType;

    const obj = {
      address: data.address,
      balance: data.balance,
    };

    return obj;
  } catch (error) {
    console.log(error);
  }
}
