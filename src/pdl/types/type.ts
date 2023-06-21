export type RealizationResponse = {
  result: {
    header: RealizationResponseHeader;
    rows: RealizationResponseRow[];
  };
};

export type RealizationResponseRow = {
  row_number: number;
  product_id: number;
  product_name: string;
  offer_id: string;
  barcode: string;
  price: number;
  commission_percent: number;
  price_sale: number;
  sale_qty: number;
  sale_amount: number;
  sale_discount: number;
  sale_commission: number;
  sale_price_seller: number;
  return_sale: number;
  return_qty: number;
  return_amount: number;
  return_discount: number;
  return_commission: number;
  return_price_seller: number;
};

export type RealizationResponseHeader = {
  doc_date: Date;
  num: string;
  start_date: Date;
  stop_date: Date;
  contract_date: Date;
  contract_num: string;
  payer_name: string;
  payer_inn: string;
  payer_kpp: string;
  rcv_name: string;
  rcv_inn: string;
  rcv_kpp: string;
  doc_amount: string;
  vat_amount: string;
  currency_code: string;
};

export type CashFlowResponse = {
  result: {
    cash_flows: CashFlowGeneral[];
    details: CashFlowDetail[];
  };
  page_count: number;
};

export type CashFlowGeneral = {
  commission_amount: number;
  currency_code: string;
  item_delivery_and_return_amount: number;
  orders_amount: number;
  period: {
    begin: Date;
    end: Date;
    id: number;
  };
  returns_amount: number;
  services_amount: number;
};
export type CashFlowDetail = {
  period: {
    begin: Date;
    end: Date;
    id: number;
  };
  payments: {
    payment: number;
    currency_code: string;
  }[];
  begin_balance_amount: number;
  delivery: {
    total: number;
    amount: number;
    delivery_services: {
      total: number;
      items: {
        name: string;
        price: number;
      }[];
    };
  };
  return: {
    total: number;
    amount: number;
    return_services: {
      total: number;
      items: {
        name: string;
        price: number;
      }[];
    };
  };
  loan: number;
  invoice_transfer: number;
  rfbs: {
    total: number;
    transfer_delivery: number;
    transfer_delivery_return: number;
    compensation_delivery_return: number;
    partial_compensation: number;
    partial_compensation_return: number;
  };
  services: {
    total: number;
    items: {
      name: string;
      price: number;
    }[];
  };
  others: {
    total: number;
    items: {
      name: string;
      price: number;
    }[];
  };
  end_balance_amount: number;
};
