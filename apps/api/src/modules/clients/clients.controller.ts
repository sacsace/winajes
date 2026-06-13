import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import type { ClientCategory, ClientInput } from './client.types';

@Controller('api/clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Get()
  findAll(@Query('category') category?: ClientCategory) {
    return this.service.findAll(category);
  }

  @Post('import')
  bulkImport(@Body() body: { records: ClientInput[]; replace?: boolean }) {
    return this.service.bulkImport(body.records ?? [], body.replace ?? false);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: ClientInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ClientInput>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
