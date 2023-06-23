import { Module } from '@nestjs/common';
import { PdlReportService } from './pdl-report.service';
import { PdlReportController } from './pdl-report.controller';
import { PdlService } from '../pdl/pdl.service';
import { PdlModule } from '../pdl/pdl.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdlReport } from './entities/pdl-report.entity';
import { PdlReportPosition } from '../pdl-report-position/entities/pdl-report-position.entity';
import { Report } from '../report/entities/report.entity';

@Module({
  imports: [
    PdlModule,
    TypeOrmModule.forFeature([PdlReport, PdlReportPosition, Report]),
  ],
  controllers: [PdlReportController],
  providers: [PdlReportService],
  exports: [],
})
export class PdlReportModule {}
