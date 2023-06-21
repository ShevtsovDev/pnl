import { Module } from '@nestjs/common';
import { PdlReportPositionService } from './pdl-report-position.service';
import { PdlReportPositionController } from './pdl-report-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdlReportPosition } from './entities/pdl-report-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PdlReportPosition])],
  exports: [PdlReportPositionService],
  controllers: [PdlReportPositionController],
  providers: [PdlReportPositionService],
})
export class PdlReportPositionModule {}
