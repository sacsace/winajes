import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Controller('api/inquiries')
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: Record<string, string>) {
    return this.service.create(body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(id, status);
  }
}
