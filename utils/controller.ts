import { TxsType, IReceipt } from './interface.js';
import { URI, BLOCK_KEY } from '../router/payment.js';

export async function submit_new_tx(receipt: TxsType) {
  const par = URI + `/txs/new?token=${BLOCK_KEY}`;
  console.log({ par });
  const receipt_data: IReceipt = {
    inputs: [
      {
        addresses: [receipt.address_from],
      },
    ],
    outputs: [
      {
        addresses: [receipt.address],
        value: parseFloat(receipt.total_amount),
      },
    ],
  };
  console.log({ receipt_data });
  const method = {
    method: 'POST',
    body: JSON.stringify(receipt_data),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log({ method });

  try {
    const resp = await fetch(par, method);

    const data_tx = (await resp.json()) as any;
    console.log(JSON.stringify(data_tx));
    console.log('errors submit tx', data_tx?.errors);
    return data_tx;
  } catch (errSubmit) {
    console.log({ errSubmit });
    throw new Error('Error when submit new txs');
  }
}
