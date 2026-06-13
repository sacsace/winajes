import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { ProjectInput } from './project.types';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('year') year?: string,
    @Query('featured') featured?: string,
  ) {
    return this.service.findAll({
      category: category && category !== 'all' ? category : undefined,
      year: year && year !== 'all' ? Number(year) : undefined,
      featured: featured !== undefined ? featured === 'true' : undefined,
    });
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Get('item/:id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() body: ProjectInput) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ProjectInput>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
