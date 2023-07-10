import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { raw } from 'express';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}
  async create(createReportDto: CreateReportDto, userId: number) {
    try {
      const candidate = await this.reportRepository.findOne({
        where: {
          shopUid: createReportDto.shopUid,
          userId,
        },
      });

      if (candidate) {
        throw new HttpException(
          'Такой магазин уже авторизован',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newReport = await this.reportRepository.create({
        ...createReportDto,
        userId,
      });
      return await this.reportRepository.save(newReport);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(userId: number) {
    try {
      const shops = await this.reportRepository.find({
        where: { userId },
      });
      return shops;
    } catch (e) {}
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
