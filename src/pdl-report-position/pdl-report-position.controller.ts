import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdlReportPositionService } from './pdl-report-position.service';
import { CreatePdlReportPositionDto } from './dto/create-pdl-report-position.dto';
import { UpdatePdlReportPositionDto } from './dto/update-pdl-report-position.dto';

@Controller('pdl-report-position')
export class PdlReportPositionController {
  constructor(
    private readonly pdlReportPositionService: PdlReportPositionService,
  ) {}

  @Post()
  create(@Body() createPdlReportPositionDto: CreatePdlReportPositionDto) {
    return this.pdlReportPositionService.create(createPdlReportPositionDto);
  }

  @Get()
  findAll() {
    return this.pdlReportPositionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pdlReportPositionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePdlReportPositionDto: UpdatePdlReportPositionDto,
  ) {
    return this.pdlReportPositionService.update(
      +id,
      updatePdlReportPositionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pdlReportPositionService.remove(+id);
  }
}
