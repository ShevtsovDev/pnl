import { Injectable } from '@nestjs/common';
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
import { ImportExelDto } from './dto/ImportExelDtop.dto';
import * as Excel from 'exceljs';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class PdlReportService {
  constructor(
    private readonly pdlService: PdlService,
    @InjectRepository(PdlReport)
    private readonly pdlReportRepository: Repository<PdlReport>,
    @InjectRepository(PdlReportPosition)
    private readonly pdlReportPositionRepository: Repository<PdlReportPosition>,
  ) {}
  async create(createPdlReportDto: CreatePdlReportDto, { id }: IExtractToken) {
    const data = await this.pdlService.create({
      costPrice: 0,
      date: new Date(),
    });

    for (let i = 0; i <= data.data.length - 1; i++) {
      const currentReportData = data.data[i];
      const candidate = await this.pdlReportRepository.findOne({
        where: {
          date: currentReportData.date,
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
        });

        await this.pdlReportRepository.save(newReport);

        for (let i = 0; i <= currentReportData.products.length - 1; i++) {
          const item = currentReportData.products[i];
          const newItem = await this.pdlReportPositionRepository.create({
            ...item,
            report_id: newReport.id,
          });
          await this.pdlReportPositionRepository.save(newItem);
        }
      }
    }
    return data;
    try {
    } catch (e) {}
  }

  async findAll(user_id: number) {
    try {
      const data = await this.pdlReportRepository.find({
        where: {
          user_id,
        },
        relations: ['reportPositions'],
        order: {
          reportPositions: {
            id: 'ASC',
          },
        },
      });
      if (data.length === 0) {
        await this.create({}, { id: user_id });
        const data = await this.pdlReportRepository.find({
          where: {
            user_id,
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
    const positions = report.reportPositions;

    const costPrice = report.reportPositions
      .map((i) => +i.costPrice)
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
      report.ozonCost -
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

  async importExel(dto: ImportExelDto, file: Express.Multer.File) {
    try {
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
      workBook
        .getWorksheet(worksheetList[0])
        .getColumn(1)
        .eachCell((cell, index) => {
          console.log(cell);
        });
      /*workBook.getWorksheet(worksheetList[0]).eachRow((row) => {
        row.eachCell((cell) => {
          console.log(cell.value);
        });
      });*/
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
