import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePdlDto } from './dto/create-pdl.dto';
import { UpdatePdlDto } from './dto/update-pdl.dto';
import { OzonRoutes } from './constant/constant';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  CashFlowDetail,
  CashFlowResponse,
  RealizationResponse,
  RealizationResponseRow,
} from './types/type';
import * as dayjs from 'dayjs';
import { IPdlReport } from '../type/index.type';
import { mapRealizationResponseRowToProduct } from './utils/index.utils';
import { ReportService } from '../report/report.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PdlService {
  instance: AxiosInstance;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {
    this.instance = axios.create({
      baseURL: OzonRoutes.Base,
    });
  }

  async create(createPdlDto: CreatePdlDto, shopId: string) {
    try {
      const shop = await this.reportRepository.findOne({
        where: {
          shopUid: shopId,
        },
      });

      if (!shop) {
      }
      const token = shop.token;
      const client = shop.clientId;

      const date = dayjs(createPdlDto.date);
      const now = dayjs(new Date());
      const response: IPdlReport[] = [];
      const columns = [];
      const rows = [];
      console.log('createPdlDto.date: ', createPdlDto);
      for (let i = 0; i <= now.month() - 1; i++) {
        const key = dayjs().month(i).startOf('day').toDate().toString();
        columns.push(key);
        const currentMonth = date.set('month', i);
        const from = currentMonth.startOf('month').add(1, 'day');
        const to = currentMonth.endOf('month');

        // Отчет о реализации
        const fincanceRealization = await this.fetchFinanceRealization(
          from.format('YYYY-MM'),
          token,
          client,
        );

        // Транзакции
        const cashFlow = await this.fetchCashFlow(
          {
            from: from.toDate(),
            to: to.toDate(),
          },
          token,
          client,
        );

        // Выруча
        const totalSale = this.calculateSale(fincanceRealization.result.rows);

        // Выплаты
        const totalPayment = this.calculatePayment(cashFlow.details);

        // Вся прибыль с озона
        const ozonCost = this.calculateOzonCost(totalSale, totalPayment);

        // Себестоимость
        const costPrice = +this.calculateCostPrice(
          fincanceRealization.result.rows,
          createPdlDto.costPrice,
        );

        // Чистая прибыль
        const income = +this.calculateIncome(totalPayment, costPrice);

        // Маржа
        const margin = +this.calculateMargin(income, totalSale) * 100;

        //ROI
        const roi = +this.calculateROI(income, costPrice) * 100;

        const ozonCostToSale =
          +this.calculateOzonCostToSale(ozonCost, totalSale) * 100;

        response.push({
          date: key,
          totalSale,
          totalPayment,
          ozonCost,
          costPrice,
          income,
          margin,
          roi,
          ozonCostToSale,
          additionalClosures: 0,
          products: mapRealizationResponseRowToProduct(
            fincanceRealization.result.rows,
          ),
        });
      }

      return {
        data: response,
        columns,
      };

      /*return {
        totalSale,
        totalPayment,
        ozonCost,
        costPrice,
        income,
        margin,
        roi,
        fincanceRealization,
      };*/
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  private async fetchFinanceRealization(
    date: string | Date,
    token: string,
    client: string,
  ) {
    return (
      await axios.post<RealizationResponse>(
        OzonRoutes.Base + OzonRoutes.Reports.Finance.Realization,
        {
          date,
        },
        {
          headers: {
            'Client-Id': client,
            'Api-Key': token,
          },
        },
      )
    ).data;
  }

  private async fetchCashFlow(
    date: { from: Date; to: Date },
    token: string,
    client: string,
  ) {
    const response = await axios.post<CashFlowResponse>(
      OzonRoutes.Base + OzonRoutes.Reports.CashFlow.List,
      {
        date: {
          from: date.from,
          to: date.to,
        },
        with_details: true,
        page: 1,
        page_size: 2,
      },
      {
        headers: {
          'Client-Id': client,
          'Api-Key': token,
        },
      },
    );
    return response.data.result;
  }

  // Подсчет выручки
  private calculateSale(rows: RealizationResponseRow[]): number {
    return rows.reduce(
      (acc, cur) => acc + (cur.sale_qty - cur.return_qty) * cur.price_sale,
      0,
    );
  }

  // Подсчет выплат
  private calculatePayment(transactions: CashFlowDetail[]) {
    return transactions.reduce((acc, cur) => acc + cur.invoice_transfer, 0);
  }

  private calculateOzonCost(sale: number, payment: number) {
    return sale - payment;
  }

  private calculateAccrual(rows: RealizationResponseRow[]): number {
    return rows.reduce((acc, cur) => acc + cur.sale_price_seller, 0);
  }

  private calculateCostPrice(
    rows: RealizationResponseRow[],
    costPrice: number,
  ) {
    const totalItems = rows.reduce(
      (acc, cur) => acc + (cur.sale_qty - cur.return_qty),
      0,
    );
    return totalItems * costPrice;
  }

  private calculateIncome(ozonCost, costPirce) {
    return ozonCost - costPirce;
  }

  private calculateMargin(income, sale) {
    return income / sale;
  }

  private calculateROI(income, costPrice) {
    return income / costPrice;
  }

  private calculateOzonCostToSale(ozonCost, sale) {
    return ozonCost / sale;
  }
  private shareOfCostsInRevenue(sale: number) {}
}
