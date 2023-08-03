interface Input {
  prev_hash: string;
  output_index: number;
  script: string;
  output_value: number;
  sequence: number;
  addresses: string[];
  script_type: string;
  age: number;
}

interface Output {
  value: number;
  script: string;
  addresses: string[];
  script_type: string;
}

export interface IExtractReceipt {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by: string;
  confirmed: string;
  received: string;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  inputs: Input[];
  outputs: Output[];
}

interface Transaction {
  block_height: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  confirmations: number;
  inputs: Input[];
  outputs: Output[];
}

export interface IReturnTx {
  tx: Transaction;
  tosign: string[];
  errors?: unknown;
}

export interface ISendSig extends IReturnTx {
  pubkeys: string[];
  signatures: string[];
}

export interface RAW {
  address: string;
  pub: string;
  pk: string;
  balance: string;
}

export interface RES {
  private: string;
  public: string;
  address: string;
  wif: string;
}

export interface FinalPayment {
  address: string;
  address_from: string;
  total_amount: string;
  recent_amount: string;
  meta_data: string;
  id_event: string;
}

export interface SubmitPayment {
  address_from: string;
  total_amount: string;
}

export interface InterPayment {
  address: string;
  total_amount: string;
}

export interface EventSubmit {
  event: string;
  address: string;
  url: string;
}

export interface IEventData {
  id: string;
  address: string;
}

export interface IReceipt {
  inputs: {
    addresses: string[];
  }[];
  outputs: {
    addresses: string[];
    value: number;
  }[];
}

export type IFetchSingleHook = EventSubmit & IEventData;

export type balanceType = { address: string; balance: string };
export type singleIdType = { id_event: string } | null;
export type TxsType = SubmitPayment & InterPayment;
