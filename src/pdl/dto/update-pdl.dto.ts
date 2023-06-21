import { PartialType } from '@nestjs/mapped-types';
import { CreatePdlDto } from './create-pdl.dto';

export class UpdatePdlDto extends PartialType(CreatePdlDto) {}
