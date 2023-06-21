import { Module } from '@nestjs/common';
import { PdlService } from './pdl.service';
import { PdlController } from './pdl.controller';
import { PdlReportService } from '../pdl-report/pdl-report.service';

@Module({
  controllers: [PdlController],
  providers: [PdlService],
  exports: [PdlService],
  imports: [],
})
export class PdlModule {}
