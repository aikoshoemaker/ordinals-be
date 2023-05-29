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

export type balanceType = { address: string; balance: string };
