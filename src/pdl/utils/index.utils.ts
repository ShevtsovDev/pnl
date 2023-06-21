import { RealizationResponseRow } from '../types/type';
import { IPdlReportMappedProduct } from '../../type/index.type';

export const mapRealizationResponseRowToProduct = (
  data: RealizationResponseRow[],
): IPdlReportMappedProduct[] => {
  return data.map(
    (item): IPdlReportMappedProduct => ({
      product_id: item.product_id,
      product_name: item.product_name,
      offer_id: item.offer_id,
    }),
  );
};
