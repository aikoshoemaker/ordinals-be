import { BLOCK_KEY, URI } from '../router/payment.js';
import { IExtractReceipt } from './interface.js';
import { supabase } from './supabase.js';
import fetch from 'node-fetch';
import { Response } from 'express';

async function update_paid_status(
  input_address: string,
  input_amount: string,
  input_receipt: string,
) {
  try {
    const { data, error } = await supabase.rpc('add_payment', {
      input_address: input_address,
      input_amount: input_amount,
      input_receipt: input_receipt,
    });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    // else if (typeof data === 'boolean' && data === true) {
    //   // check if data is of type boolean
    //   console.log('update paid status', data); // data is of type boolean
    //   return data;
    // } else {
    //   console.log('Unexpected data type');
    //   throw new Error('shit happen');
    // }
    //
    console.log('data supabase', data);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error('shit happen when use rpc');
  }
}

export async function extractReceipt(obj: IExtractReceipt, res: Response) {
  const confirmTick = obj.confirmations;
  if (confirmTick < 4) return;

  const hashes = obj.hash;

  try {
    const hash_data = await search_hash(hashes);

    const addresses = hash_data.addresses;
    if (addresses.length != 2) return;

    const address_from = hash_data.inputs[0].addresses[0];

    const address = addresses.find((a) => a !== address_from);
    if (!address) throw new Error('address output not found');

    const { outputs } = hash_data;
    const output = outputs.find((el) => el.addresses.includes(address));
    if (!output) throw new Error('value output not found');

    const value = output.value.toString();

    const data = await update_paid_status(address, value, hashes);

    return data;
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'shit happen searching hash' });
  }
}

async function search_hash(hashes: string) {
  const par =
    URI + '/txs/' + hashes + `?token=${BLOCK_KEY}&includeConfidence=true`;

  try {
    const resp = await fetch(par);
    const hash_data = (await resp.json()) as IExtractReceipt;
    console.log(JSON.stringify(hash_data));
    return hash_data;
  } catch (err) {
    console.log(err);
    throw new Error('error searching hash');
  }
}
