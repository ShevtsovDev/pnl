import { Injectable } from '@nestjs/common';
import { CreatePdlReportPositionDto } from './dto/create-pdl-report-position.dto';
import { UpdatePdlReportPositionDto } from './dto/update-pdl-report-position.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PdlReportPosition } from './entities/pdl-report-position.entity';

@Injectable()
export class PdlReportPositionService {
  constructor(
    @InjectRepository(PdlReportPosition)
    private readonly pdlReportPositionRepository: Repository<PdlReportPosition>,
  ) {}
  create(createPdlReportPositionDto: CreatePdlReportPositionDto) {
    return 'This action adds a new pdlReportPosition';
  }

  findAll() {
    return `This action returns all pdlReportPosition`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdlReportPosition`;
  }

  async update(
    id: number,
    updatePdlReportPositionDto: UpdatePdlReportPositionDto,
  ) {
    const { reportId, costPrice } = updatePdlReportPositionDto;

    const reportPosition = await this.pdlReportPositionRepository.findOne({
      where: {
        id,
        report_id: reportId,
      },
    });
    const updatedPosition = await (reportPosition.costPrice =
      costPrice.toString());
    await this.pdlReportPositionRepository.save(reportPosition);
    return `This action updates a #${id} pdlReportPosition`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdlReportPosition`;
  }
}
