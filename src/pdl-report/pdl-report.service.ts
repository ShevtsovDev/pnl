import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePdlReportDto } from './dto/create-pdl-report.dto';
import { UpdatePdlReportDto } from './dto/update-pdl-report.dto';
import { IExtractToken } from '../auth/interface/index.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { PdlService } from '../pdl/pdl.service';
import { Pdl } from '../pdl/entities/pdl.entity';
import { Repository } from 'typeorm';
import { PdlReport } from './entities/pdl-report.entity';
import { PdlReportPosition } from '../pdl-report-position/entities/pdl-report-position.entity';
import { RecalculatePdlReportDto } from './dto/recalculate-pdl-report.dto';
import { ExportExelDto, ImportExelDto } from './dto/ImportExelDtop.dto';
import * as Excel from 'exceljs';
import * as fs from 'fs';
import { join } from 'path';
import { Column } from 'exceljs';
@Injectable()
export class PdlReportService {
  constructor(
    private readonly pdlService: PdlService,
    @InjectRepository(PdlReport)
    private readonly pdlReportRepository: Repository<PdlReport>,
    @InjectRepository(PdlReportPosition)
    private readonly pdlReportPositionRepository: Repository<PdlReportPosition>,
  ) {}
  async create(
    createPdlReportDto: CreatePdlReportDto,
    { id }: IExtractToken,
    shopId: string,
  ) {
    const data = await this.pdlService.create(
      {
        costPrice: 0,
        date: new Date(),
      },
      shopId,
    );

    for (let i = 0; i <= data.data.length - 1; i++) {
      const currentReportData = data.data[i];
      const candidate = await this.pdlReportRepository.findOne({
        where: {
          date: currentReportData.date,
          report_id: shopId,
        },
      });

      if (!candidate) {
        const newReport = await this.pdlReportRepository.create({
          user_id: id,
          totalSale: currentReportData.totalSale,
          date: currentReportData.date,
          totalPayment: currentReportData.totalPayment,
          ozonCost: currentReportData.ozonCost,
          costPrice: currentReportData.costPrice,
          income: currentReportData.income,
          margin: currentReportData.margin,
          roi: currentReportData.roi,
          report_id: shopId,
        });

        await this.pdlReportRepository.save(newReport);

        for (let i = 0; i <= currentReportData.products.length - 1; i++) {
          const item = currentReportData.products[i];

          if (item.count > 0) {
            const newItem = await this.pdlReportPositionRepository.create({
              ...item,
              report_id: newReport.id,
            });
            await this.pdlReportPositionRepository.save(newItem);
          }
        }
      }
    }
    return data;
    try {
    } catch (e) {}
  }

  async findAll(user_id: number, shopId: string) {
    try {
      const data = await this.pdlReportRepository.find({
        where: {
          user_id: user_id,
          report_id: shopId,
        },
        relations: ['reportPositions'],
        order: {
          reportPositions: {
            id: 'ASC',
          },
        },
      });
      if (data.length === 0) {
        await this.create({}, { id: user_id }, shopId);

        const data = await this.pdlReportRepository.find({
          where: {
            report_id: shopId,
            user_id: user_id,
          },
          relations: ['reportPositions'],
          order: {
            reportPositions: {
              id: 'ASC',
            },
          },
        });
        return data;
      }
      return data;
    } catch (e) {
      console.log(e.message);
    }
  }

  async recalculate(dto: RecalculatePdlReportDto) {
    const { report_uuid, additionalClosures, tax } = dto;
    const report = await this.pdlReportRepository.findOne({
      where: {
        uuid: report_uuid,
      },
      relations: ['reportPositions'],
    });

    const costPrice = report.reportPositions
      .map((i) => +i.costPrice * i.count)
      .reduce((acc, cur) => acc + cur, 0);

    report.taxPercentage = tax !== undefined ? tax : report.taxPercentage;
    report.taxValue =
      tax !== undefined
        ? (report.taxPercentage / 100) * report.totalPayment
        : report.taxValue;

    report.additionalClosures =
      additionalClosures !== undefined
        ? additionalClosures
        : report.additionalClosures;

    const income = +(
      report.totalPayment -
      costPrice -
      report.additionalClosures -
      report.taxValue
    ).toFixed(2);

    const margin = +(income / report.totalSale) * 100;
    const roi = +(income / costPrice);
    const ozonCostToSale = +(report.ozonCost / report.totalSale) * 100;

    report.income = income;
    report.roi = roi;
    report.costPrice = costPrice;
    report.margin = margin;
    report.ozonCostToSale = ozonCostToSale;

    await this.pdlReportRepository.save(report);
    return costPrice;
  }

  async exportExel(report_id: number) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Себестоимость');
    const data = await this.pdlReportPositionRepository.find({
      where: {
        report_id,
      },
    });
    const columns: Partial<Column>[] = [
      {
        key: 'id',
        header: 'ID',
        width: 10,
        hidden: true,
        protection: { locked: true },
      },
      {
        key: 'product_id',
        header: 'Внутренний id',
        width: 10,
        protection: { locked: true },
      },
      {
        key: 'product_name',
        header: 'Продукт',
        width: 30,
        protection: { locked: true },
      },
      {
        key: 'offer_id',
        header: 'Артикул',
        width: 10,
        protection: { locked: true },
      },
      {
        key: 'count',
        header: 'Продано',
        width: 10,
        protection: { locked: true },
      },
      {
        key: 'costPrice',
        header: 'Себестоимость за еденицу',
        width: 25,
        style: { alignment: { horizontal: 'right' } },
      },
    ];
    worksheet.columns = columns;
    const mappedData = data.map((i) => ({ ...i }));
    worksheet.addRows(mappedData);

    return workbook;
  }
  async importExel(dto: ImportExelDto, file: Express.Multer.File) {
    try {
      if (
        file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        const columns = [
          { key: 'id', colNumber: 1 },
          { key: 'product_id', colNumber: 2 },
          { key: 'product_name', colNumber: 3 },
          { key: 'offer_id', colNumber: 4 },
          { key: 'count', colNumber: 5 },
          { key: 'costPrice', colNumber: 6 },
        ];
        const filePath = join(__dirname, 'image', file.originalname);
        if (!fs.existsSync(join(__dirname, 'image'))) {
          fs.mkdirSync(join(__dirname, 'image'));
        }

        fs.writeFileSync(filePath, file.buffer);
        const workBook = new Excel.Workbook();
        await workBook.xlsx.readFile(filePath);
        const worksheetList = [];
        workBook.eachSheet((item) => {
          worksheetList.push(item.name);
        });
        const json = [];
        workBook
          .getWorksheet(worksheetList[0])
          .eachRow({ includeEmpty: true }, function (row, rowNumber) {
            const rowObject = {};
            row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
              const key = columns.find(
                (col) => col.colNumber === colNumber,
              )!.key;
              if (key) {
                if (key === 'costPrice') {
                  console.log(cell.value);
                }
                rowObject[key] = cell.value;
              }
            });
            json.push(rowObject);
          });
        json.splice(0, 1);

        for (const item of json) {
          const position = await this.pdlReportPositionRepository.findOne({
            where: {
              id: item.id,
            },
          });
          if (position) {
            position.costPrice = item.costPrice;
            await this.pdlReportPositionRepository.save(position);
          }
        }
        return 'ok';
      } else {
        throw new HttpException(
          'Допустимые форматы  файлов: .xlsx',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} pdlReport`;
  }

  update(id: number, updatePdlReportDto: UpdatePdlReportDto) {
    return `This action updates a #${id} pdlReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdlReport`;
  }
}
