import { RealizationResponseRow } from '../pdl/types/type';

export interface IPdlReport {
  date: string;
  totalSale: number;
  totalPayment: number;
  ozonCost: number;
  costPrice: number;
  income: number;
  margin: number;
  roi: number;
  ozonCostToSale: number;
  additionalClosures: number;
  products: IPdlReportMappedProduct[];
}

export interface IPdlReportMappedProduct {
  product_id: number;
  product_name: string;
  offer_id: string;
  count: number;
}
