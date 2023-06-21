import { PartialType } from '@nestjs/mapped-types';
import { CreatePdlReportPositionDto } from './create-pdl-report-position.dto';

export class UpdatePdlReportPositionDto extends PartialType(
  CreatePdlReportPositionDto,
) {
  reportId: number;
  costPrice: number;
}
