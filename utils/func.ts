import * as dotenv from 'dotenv';
import { RAW, balanceType, RES, EventSubmit, IEventData } from './interface.js';
import fs from 'fs';

dotenv.config();

const BLOCK_KEY = process.env.BLOCK_KEY;

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

export async function genAddress() {
  const fetchAddress = await fetch(URL + '/addrs?token=' + BLOCK_KEY, {
    method: 'POST',
  });

  if (!fetchAddress) {
    throw new Error('Something went wrong');
  }

  const data = (await fetchAddress.json()) as RES;
  return data;
}

export async function submitEvent(submitEvent: EventSubmit) {
  const respons = await fetch(URL + '/hooks?token=' + BLOCK_KEY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submitEvent),
  });
  const eventResponseData = await respons.json();
  console.log({ eventResponseData });

  const data: IEventData = {
    id: eventResponseData.id,
    address: eventResponseData.address,
  };

  return data;
}
