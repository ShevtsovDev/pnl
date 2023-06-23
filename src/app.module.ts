import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { PdlModule } from './pdl/pdl.module';
import { PdlReportModule } from './pdl-report/pdl-report.module';
import { PdlReportPositionModule } from './pdl-report-position/pdl-report-position.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PdlModule,
    DatabaseModule,
    PdlReportModule,
    PdlReportPositionModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
