import express from 'express';
import {
  EventSubmit,
  SubmitPayment,
  FinalPayment,
} from '../utils/interface.js';
import * as dotenv from 'dotenv';
import { genAddress, submitEvent } from '../utils/func.js';
import { encryptData } from '../utils/crypt.js';
dotenv.config();

export const router = express.Router();
router.use(express.json());

const callback = process.env.URL_CALLBACK as string;

router.post('/submit', async (req, res) => {
  const paymentData: SubmitPayment = req.body;
  console.log({ paymentData });

  try {
    const callAddress = await genAddress();

    const event_data: EventSubmit = {
      url: callback,
      address: callAddress.address,
      event: 'tx-confidence',
    };

    const parseBase64 = btoa(JSON.stringify(callAddress));
    const enc = encryptData(parseBase64);

    const eventResponse = await submitEvent(event_data);

    const data: FinalPayment = {
      address: callAddress.address,
      address_from: paymentData.address_from,
      total_amount: paymentData.total_amount,
      recent_amount: '0',
      meta_data: enc,
      id_event: eventResponse.id,
    };

    const delivered_data: SubmitPayment = {
      address_from: callAddress.address,
      total_amount: paymentData.total_amount,
    };

    res.status(200).json({ delivered_data });
  } catch (error) {
    console.log('SubmitPayment Error \n');

    console.log({ error });

    res.status(400).json({ error });
  }
});

router.get('/', async (req, res) => {
  res.send('test from router payment');
});
