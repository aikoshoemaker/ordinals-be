import express from 'express';
import { extractReceipt } from '../utils/extract.js';

export const router = express.Router();
router.use(express.json());

const obj_event = {
  block_hash:
    '00006a48aef8952238056e1e7d8097cdb4a113f5ced228a6f4cc59c40ecf255a',
  block_height: 860664,
  block_index: 1,
  hash: '1cb83acad08bf28b5d1dd217144ace27365960ff4ae52e9ed03a77427acb6ea5',
  addresses: [
    'C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9',
    'CApfFu624GToF8xyrkdgm91S8aw5wuzkmq',
  ],
  total: 9873800,
  fees: 25600,
  size: 225,
  vsize: 225,
  preference: 'high',
  relayed_by: '180.242.131.93',
  confirmed: '2023-06-23T06:30:43Z',
  received: '2023-06-23T06:30:22.92Z',
  ver: 1,
  double_spend: false,
  vin_sz: 1,
  vout_sz: 2,
  confirmations: 4,
  inputs: [
    {
      prev_hash:
        '28efe0a3814a4ffa6713ce96d93e9be1002336e15090b21314063bab849818e9',
      output_index: 1,
      script:
        '47304402207156493a9e7a4d36d1d225e47773efa544302291459738df9bdb89864d79635202201639cbc283e8ff7f3ac73e609bcb9ca51b488a2833a005f62925bca81fc5c4aa012102502fd39278f97441e8e2df2dd6e270614eea69bf03177c51302bcbbd7d67e238',
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
};

const new_hash = {
  block_height: -1,
  block_index: -1,
  hash: '3b4db9d428789f9fd6eae419d92f4ce77498e473acc4dd12935817d9a0c7b185',
  addresses: [
    'C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9',
    'CApfFu624GToF8xyrkdgm91S8aw5wuzkmq',
  ],
  total: 9772200,
  fees: 25600,
  size: 226,
  vsize: 226,
  preference: 'high',
  relayed_by: '180.242.131.93',
  received: '2023-06-27T09:39:28.67Z',
  ver: 1,
  double_spend: false,
  vin_sz: 1,
  vout_sz: 2,
  confirmations: 0,
  inputs: [
    {
      prev_hash:
        '1cb83acad08bf28b5d1dd217144ace27365960ff4ae52e9ed03a77427acb6ea5',
      output_index: 1,
      script:
        '483045022100a1594c91cc0071019a25ec7574de885337a80d7db66d26be5298614464cce89402206e6616389625adb8f85f18d67978ac32e2fe2dcdcb6757b9a8f76fb1ba24b38c012102502fd39278f97441e8e2df2dd6e270614eea69bf03177c51302bcbbd7d67e238',
      output_value: 9797800,
      sequence: 4294967295,
      addresses: ['C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9'],
      script_type: 'pay-to-pubkey-hash',
      age: 860664,
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
      value: 9696200,
      script: '76a914aa1727731e7fe2f51d0eb80830211ea795c669b088ac',
      addresses: ['C8deCKTBHL3QbX3JBM91WZdAFmkbN1p1p9'],
      script_type: 'pay-to-pubkey-hash',
    },
  ],
};

router.get('/', (req, res) => {
  res.send('test from router receive ');
});

router.get('/paid', async (req, res) => {
  const data = await extractReceipt(obj_event, res);
  if (data) {
    res.json({ message: 'success paid', isPaid: data });
  } else {
    res.status(400).json({ message: 'error global' });
  }
});
