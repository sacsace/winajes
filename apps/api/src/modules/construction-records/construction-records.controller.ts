import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
} from '@nestjs/common';
import { ConstructionRecordsService } from './construction-records.service';
import type { ConstructionRecordInput } from './construction-record.types';

@Controller('api/construction-records')
export class ConstructionRecordsController {
  constructor(private readonly service: ConstructionRecordsService) {}

  @Get()
  findAll(
    @Query('year') year?: string,
    @Query('client') client?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({
      year: year ? Number(year) : undefined,
      client,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('years')
  findYears() {
    return this.service.findYears();
  }

  @Post('import')
  bulkImport(@Body() body: { records: ConstructionRecordInput[]; replace?: boolean }) {
    return this.service.bulkImport(body.records ?? [], body.replace ?? false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: ConstructionRecordInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ConstructionRecordInput>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
