import { IExtractReceipt } from './interface.js';
import { supabase } from './supabase.js';

export function extractReceipt(obj: IExtractReceipt) {
  const confirmTick = obj.confirmations;
  if (confirmTick < 4) return;
  const addresses = obj.addresses;
  if (addresses.length != 2) return;

  const address_from = obj.inputs[0].addresses[0];

  const address = addresses.find((a) => a !== address_from);
  if (!address) throw new Error('address output not found');

  const { outputs } = obj;
  const output = outputs.find((el) => el.addresses.includes(address));
  if (!output) throw new Error('value output not found');

  const value = output.value;

  const data = {
    address,
    address_from,
    value,
  };

  // const { data, error } = await supabase
  //   .from('ordinals_payment')
  //   .update({ recent_amount: value })
  //   .match({ address_from: address_from })
  //   .select();
  //
  // if (error) {
  //   console.log('update db error', error);
  // }
  // console.log('data json db  =  ', JSON.stringify(data));

  return data;
}
