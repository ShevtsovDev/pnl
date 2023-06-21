import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PdlReportService } from './pdl-report.service';
import { CreatePdlReportDto } from './dto/create-pdl-report.dto';
import { UpdatePdlReportDto } from './dto/update-pdl-report.dto';
import {
  ExtractDataFromToken,
  ExtractToken,
} from '../auth/decorator/current-user.decorator';
import { IExtractToken } from '../auth/interface/index.interface';
import { RecalculatePdlReportDto } from './dto/recalculate-pdl-report.dto';
import { ImportExelDto } from './dto/ImportExelDtop.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pdl-report')
export class PdlReportController {
  constructor(private readonly pdlReportService: PdlReportService) {}

  @Post()
  create(
    @Body() createPdlReportDto: CreatePdlReportDto,
    @ExtractDataFromToken() token: IExtractToken,
  ) {
    return this.pdlReportService.create(createPdlReportDto, token);
  }

  @Get()
  findAll(@ExtractDataFromToken() token: IExtractToken) {
    return this.pdlReportService.findAll(token.id);
  }

  @Post(':uuid')
  recalculate(
    @Param('uuid') uuid: string,
    @Body() recalculateDto: RecalculatePdlReportDto,
  ) {
    return this.pdlReportService.recalculate({
      report_uuid: uuid,
      ...recalculateDto,
    });
  }

  @Post('/exel/:uuid')
  @UseInterceptors(FileInterceptor('file'))
  importExel(
    @Param('uuid') uuid: string,
    @Body() importExelDto: ImportExelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pdlReportService.importExel(importExelDto, file);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePdlReportDto: UpdatePdlReportDto,
  ) {
    return this.pdlReportService.update(+id, updatePdlReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdlReportService.remove(+id);
  }
}
