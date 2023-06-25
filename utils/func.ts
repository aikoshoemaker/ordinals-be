import * as dotenv from 'dotenv';
import {
  RAW,
  balanceType,
  RES,
  EventSubmit,
  IEventData,
  SubmitPayment,
} from './interface.js';
import { Response } from 'express';
import qrcode from 'qrcode';
import fetch from 'node-fetch';
import fs from 'fs';

dotenv.config();

const BLOCK_KEY = process.env.BLOCK_KEY;
const URI = process.env.URL_ENDPOINT;

export function readAddresses(): RAW[] {
  return JSON.parse(fs.readFileSync('./secret/address.json', 'utf8'));
}

export async function getBalance(addr: string) {
  try {
    const respons = await fetch(URI + `/addrs/${addr}/balance`);
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

export async function genAddress(): Promise<RES | undefined> {
  try {
    console.log('begin generate address');
    const fetchAddress = await fetch(URI + '/addrs?token=' + BLOCK_KEY, {
      method: 'POST',
    });

    if (!fetchAddress) {
      throw new Error('Something went wrong');
    }

    const data = (await fetchAddress.json()) as RES;
    return data;
  } catch (err) {
    console.log('err gen adress', err);
    throw new Error('err gen adress');
  }
}

export async function submitEvent(submitEvent: EventSubmit) {
  try {
    const respons = await fetch(URI + '/hooks?token=' + BLOCK_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submitEvent),
    });
    const eventResponseData = (await respons.json()) as IEventData;
    console.log({ eventResponseData });

    if (eventResponseData.id === null) {
      throw new Error('error submit event : no data id');
    }

    const data = {
      id: eventResponseData.id,
      address: eventResponseData.address,
    };

    return data;
  } catch (err) {
    console.log('error submit event', err);
    throw new Error('error submit event');
  }
}

export async function blockFetch<T>(
  param: string,
  method?: object,
): Promise<T | undefined> {
  if (!method) {
    method = {
      method: 'GET',
    };
  }
  try {
    console.log({ ...method });
    const respons = await fetch(URI + param, method);
    const data = (await respons.json()) as T;
    return data;
  } catch (err) {
    console.log({ err });
  }
}

export async function sendQr(data_submit: SubmitPayment, res: Response) {
  try {
    const { address_from, total_amount } = data_submit;
    const qr_code = await qrcode.toDataURL(address_from);

    // res.type('png');
    // return res.send(Buffer.from(qr_code.split(',')[1], 'base64'));
    //
    //
    const data_send: Required<SubmitPayment> = {
      address_from: qr_code,
      total_amount,
    };
    return res.status(200).json(data_send);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: 'error generate qrcode' });
  }
}
