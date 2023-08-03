import express from 'express';
import {
  EventSubmit,
  SubmitPayment,
  FinalPayment,
  singleIdType,
  IFetchSingleHook,
  TxsType,
  IReceipt,
} from '../utils/interface.js';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { blockFetch, genAddress, sendQr, submitEvent } from '../utils/func.js';
import { encryptData } from '../utils/crypt.js';
import { supabase } from '../utils/supabase.js';
import { getSign, send_signature, submit_new_tx } from '../utils/controller.js';
dotenv.config();

export const router = express.Router();
router.use(express.json());

export const callback = process.env.URL_CALLBACK as string;
export const URI = process.env.URL_ENDPOINT as string;
export const BLOCK_KEY = process.env.BLOCK_KEY as string;

router.post('/submit', async (req, res) => {
  const paymentData: SubmitPayment = req.body;
  console.log({ paymentData });

  try {
    const callAddress = await genAddress();
    if (!callAddress) {
      throw new Error('error submit event');
    }

    const event_data: EventSubmit = {
      url: callback + '/callback',
      address: callAddress.address,
      event: 'tx-confirmation',
    };

    const parseBase64 = btoa(JSON.stringify(callAddress));
    const enc = encryptData(parseBase64);

    const eventResponse = await submitEvent(event_data);

    const data: Required<FinalPayment> = {
      address: callAddress.address,
      address_from: paymentData.address_from,
      total_amount: paymentData.total_amount,
      recent_amount: '0',
      meta_data: enc,
      id_event: eventResponse.id,
    };

    const { error } = await supabase.from('ordinals_payment').insert(data);

    if (error) {
      console.log('error supabase', error);
      throw new Error('failed to insert');
    }

    const delivered_data: SubmitPayment = {
      address_from: callAddress.address,
      total_amount: paymentData.total_amount,
    };

    return sendQr(delivered_data, res);
  } catch (err) {
    console.log('SubmitPayment Error \n');

    console.log({ err });

    res.status(400).json({ message: err.message });
  }
});

router.get('/listhook', async (req, res) => {
  const resp = await fetch(URI + '/hooks?token=' + BLOCK_KEY, {
    method: 'GET',
  });

  const data = await resp.json();
  console.log({ data });
  res.json(data);
});

router.get('/', async (req, res) => {
  res.send('test from router payment');
});

router.get('/event_id/:address', async (req, res) => {
  const address = req.params.address;
  console.log({ address });
  try {
    const { data, error } = await supabase
      .from('ordinals_payment')
      .select('id_event')
      .eq('address', address)
      .single();

    if (error) {
      console.log({ error });
      throw new Error('no data querry');
    }
    data as singleIdType;

    const { id_event } = data;
    console.log({ id_event });
    const par = `/hooks/${id_event.trim()}`;
    console.log('param block fetch  = ', par);
    const hook_data = await blockFetch<IFetchSingleHook>(par);
    if (!hook_data) {
      throw new Error('shit happens');
    }

    res.json({ hook_data });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//list all value
router.get('/list_all', async (req, res) => {
  try {
    const { data, error } = await supabase.from('ordinals_payment').select('*');

    if (error) {
      console.log({ error });
      throw new Error('no data querry');
    }

    console.log({ data });
    res.json({ data });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post('/send_btc', async (req, res) => {
  const reqBody = req.body as TxsType;
  console.log({ reqBody });
  try {
    const receipt = await submit_new_tx(reqBody);
    const { tosign } = receipt;
    const signature = await getSign(tosign[0]);
    const data_resp = await send_signature(receipt, signature);

    res.status(200).json({ data_resp });
  } catch (err) {
    console.log('errors submit ', err);
    throw new Error('error global send_btc');
  }
});

router.post('/transact/new', async (req, res) => {
  const receipt = req.body as TxsType;
  console.log({ receipt });

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
    res.json(JSON.stringify(data_tx));
  } catch (err) {
    console.log('err', err);
    res.status(404).json({ err });
  }
});

router.get('/transact/send', async (req, res) => {
  const par = URI + `/txs/send?token=${BLOCK_KEY}`;

  const new_payload = {
    tx: {
      block_height: -1,
      block_index: -1,
      hash: '09e31eb3cd2e5f5d227057cc820c837c4013055372087ad65adb12f80c149360',
      addresses: [
        'C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9',
        'CApfFu624GToF8xyrkdgm91S8aw5wuzkmq',
      ],
      total: 9873800,
      fees: 25600,
      size: 226,
      vsize: 226,
      preference: 'high',
      relayed_by: '180.242.131.93',
      received: '2023-06-23T06:23:25.463430937Z',
      ver: 1,
      double_spend: false,
      vin_sz: 1,
      vout_sz: 2,
      confirmations: 0,
      inputs: [
        {
          prev_hash:
            '28efe0a3814a4ffa6713ce96d93e9be1002336e15090b21314063bab849818e9',
          output_index: 1,
          output_value: 9899400,
          sequence: 4294967295,
          addresses: ['C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9'],
          script_type: 'pay-to-pubkey-hash',
          age: 859872,
        },
      ],
      outputs: [
        {
          value: 76000,
          script: '76a914c21cde16623f9a4bb9b151890eaa979adf17e3fd88ac',
          addresses: ['CApfFu624GToF8xyrkdgm91S8aw5wuzkmq'],
          script_type: 'pay-to-pubkey-hash',
        },
        {
          value: 9797800,
          script: '76a914aa1727731e7fe2f51d0eb80830211ea795c669b088ac',
          addresses: ['C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9'],
          script_type: 'pay-to-pubkey-hash',
        },
      ],
    },
    tosign: [
      '3bbbf13032f976bf65eaf062a9b5d90fecd4f68b16b7d77b8a440cef51836df4',
    ],
    signatures: [
      '304402207156493a9e7a4d36d1d225e47773efa544302291459738df9bdb89864d79635202201639cbc283e8ff7f3ac73e609bcb9ca51b488a2833a005f62925bca81fc5c4aa',
    ],
    pubkeys: [
      '02502fd39278f97441e8e2df2dd6e270614eea69bf03177c51302bcbbd7d67e238',
    ],
  };

  const method = {
    method: 'POST',
    body: JSON.stringify(new_payload),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('option : ', method);
  try {
    const resp = await fetch(par, method);
    const data_resp = await resp.json();
    console.log('data = ', data_resp);
    res.json(JSON.stringify(data_resp));
  } catch (err) {
    console.log({ err });
    res.status(400).json({ err });
  }
});

router.get('/search_hash/:hash', async (req, res) => {
  const { hash } = req.params;
  const par =
    URI + '/txs/' + hash + `?token=${BLOCK_KEY}&includeConfidence=true`;
  console.log({ par });
  try {
    const resp = await fetch(par);
    const tx_data = await resp.json();
    console.log(JSON.stringify(tx_data));
    res.send(JSON.stringify(tx_data));
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify(err));
  }
});

router.delete('/delete_hook/:hook', async (req, res) => {
  const hook = req.params.hook;
  const par = URI + '/hooks/' + hook;
  console.log({ par });

  try {
    const resp = await fetch(par);
    console.log('status = ', resp.status);
    res.send(resp.status);
  } catch (err) {
    console.log(err);
    res.send(JSON.stringify(err));
  }
});
