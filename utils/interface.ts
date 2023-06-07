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

export type balanceType = { address: string; balance: string };
