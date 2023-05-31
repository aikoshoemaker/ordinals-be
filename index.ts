import express from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import { RAW, RES } from './utils/interface.js';
import { readAddresses, getBalance } from './utils/func.js';
import { encryptData, decryptData } from './utils/crypt.js';

dotenv.config();

const URL = process.env.URL_ENDPOINT;
const BLOCK_KEY = process.env.BLOCK_KEY;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello express TS');
});

app.get('/gen-address/:num', async (req, res) => {
  const num = parseInt(req.params.num);

  try {
    const raw_data: RAW[] = readAddresses();

    for (let i = 0; i < num; i++) {
      const fetchAddress = await fetch(URL + '/addrs?token=' + BLOCK_KEY, {
        method: 'POST',
      });

      if (!fetchAddress) {
        throw new Error('Something went wrong');
      }

      const data = (await fetchAddress.json()) as RES;

      console.log({ data });

      const obj: RAW = {
        address: data.address,
        pub: data.public,
        pk: data.private,
        balance: '0',
      };

      raw_data.push(obj);
    }

    console.log(raw_data);

    fs.writeFileSync(
      './secret/address.json',
      JSON.stringify(raw_data, null, 4),
    );

    res.send('ok');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/fund-address/:num', async (req, res) => {
  let num: number;

  num = parseInt(req.params.num);

  if (!num) {
    num = 1;
  }

  const addresses = readAddresses();

  const data = {
    address: addresses[num].address,
    amount: 1000,
  };

  try {
    const respons = await fetch(URL + '/faucet?token=' + BLOCK_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const resp = await respons.json();
    console.log({ resp });

    addresses[num].balance = data.amount.toString();
    console.log('balance', data.amount.toString());

    fs.writeFileSync(
      './secret/address.json',
      JSON.stringify(addresses, null, 4),
    );

    res.status(200).json({ data });
  } catch (error) {
    res.status(404).send('error');
  }
});

app.get('/balance/:addrs', async (req, res) => {
  const addrs = req.params.addrs;
  const balance = await getBalance(addrs);
  res.json({ balance });
});

app.get('/get-all', (req, res) => {
  const data = readAddresses();
  res.json({ data });
});

app.get('/test', async (req, res) => {
  try {
    const addresses = readAddresses();

    const address = addresses[0];
    console.log({ address });

    const base64data = btoa(JSON.stringify(address));
    console.log({ base64data });

    const enc = encryptData(base64data);
    console.log({ enc });

    const dect = decryptData(enc);

    console.log('decrypt = ', dect);

    console.log('parse to json = ', atob(dect));

    res.json({ base64: base64data, encr: enc, dect: dect });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
});

app.listen(8000, function () {
  console.log('listen port 8000');
});
