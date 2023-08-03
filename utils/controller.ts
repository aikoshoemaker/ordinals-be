import { URI, BLOCK_KEY } from '../router/payment.js';
import { exec } from 'child_process';
import { TxsType, IReceipt, IReturnTx, ISendSig } from './interface.js';
import fetch from 'node-fetch';

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

    const data_tx = (await resp.json()) as IReturnTx;
    console.log('return data submit_new_tx  :  ', data_tx);
    const errorsTx = data_tx?.errors;
    if (errorsTx) {
      console.log('errors submit tx', errorsTx);
      throw new Error('error submit new tx');
    }
    console.log(JSON.stringify(data_tx.tx));
    return data_tx;
  } catch (errSubmit) {
    console.log({ errSubmit });
    throw new Error('Error when submit new txs');
  }
}

export async function getSign(toSign: string): Promise<string> {
  const workingDir = 'M:/Project/btcutils/signer';
  const command = `signer.exe ${toSign} 702e5891e49cc7adcbe739bcd6cd7ccc07cbe1117b9dfa16d86a92c82d43e133`;

  return new Promise<string>((resolve, reject) => {
    exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        reject(new Error('error execut'));
        return;
      }

      // Command executed successfully
      console.log('Command executed successfully.');
      console.log('Command output:');
      console.log({ stdout });

      if (stderr) {
        console.error('Command error:');
        console.error(stderr);

        reject(new Error('error STDERR execut'));
      }

      resolve(stdout.trim());
    });
  });
}

export async function send_signature(receipt: IReturnTx, signature: string) {
  const signatures = [signature];
  const pubkeys = [
    '02502fd39278f97441e8e2df2dd6e270614eea69bf03177c51302bcbbd7d67e238',
  ];

  const par = URI + `/txs/send?token=${BLOCK_KEY}`;
  console.log('parameter  == ', par);
  const data_send: ISendSig = {
    tx: receipt.tx,
    tosign: receipt.tosign,
    pubkeys: pubkeys,
    signatures: signatures,
  };
  console.log('data_send  == ', data_send);

  const method = {
    method: 'POST',
    body: JSON.stringify(data_send),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const resp = await fetch(par, method);
    if (resp.status == 400) {
      throw new Error('error send signature');
    }
    const data_resp = await resp.json();
    console.log('data = ', data_resp);
    return data_resp;
  } catch (err) {
    console.log({ err });
    throw new Error('error send signature');
  }
}
