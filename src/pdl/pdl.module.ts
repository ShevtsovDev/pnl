import { Module } from '@nestjs/common';
import { PdlService } from './pdl.service';
import { PdlController } from './pdl.controller';
import { PdlReportService } from '../pdl-report/pdl-report.service';
import { ReportModule } from '../report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../report/entities/report.entity';

@Module({
  controllers: [PdlController],
  providers: [PdlService],
  exports: [PdlService],
  imports: [ReportModule, TypeOrmModule.forFeature([Report])],
})
export class PdlModule {}
