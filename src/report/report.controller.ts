import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ExtractDataFromToken } from '../auth/decorator/current-user.decorator';
import { IExtractToken } from '../auth/interface/index.interface';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(
    @ExtractDataFromToken() token: IExtractToken,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.create(createReportDto, token.id);
  }

  @Get()
  findAll(@ExtractDataFromToken() token: IExtractToken) {
    return this.reportService.findAll(token.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
