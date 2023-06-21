import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PdlService } from './pdl.service';
import { CreatePdlDto } from './dto/create-pdl.dto';
import { UpdatePdlDto } from './dto/update-pdl.dto';

@Controller('pdl')
export class PdlController {
  constructor(private readonly pdlService: PdlService) {}

  @Post()
  create(@Body() createPdlDto: CreatePdlDto) {
    return this.pdlService.create(createPdlDto);
  }
}
