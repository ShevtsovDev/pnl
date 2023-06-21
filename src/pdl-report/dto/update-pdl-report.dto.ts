import { PartialType } from '@nestjs/mapped-types';
import { CreatePdlReportDto } from './create-pdl-report.dto';

export class UpdatePdlReportDto extends PartialType(CreatePdlReportDto) {}
