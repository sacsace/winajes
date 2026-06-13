import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { PROJECTS_SEED } from '../../data/projects.seed';
import type { ProjectInput } from './project.types';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Project)
    private readonly repo: Repository<Project>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0 && PROJECTS_SEED.length > 0) {
      for (const item of PROJECTS_SEED) {
        await this.create(item);
      }
    }
  }

  findAll(filters?: { category?: string; year?: number; featured?: boolean }) {
    const qb = this.repo.createQueryBuilder('project');
    if (filters?.category) qb.andWhere('project.category = :category', { category: filters.category });
    if (filters?.year) qb.andWhere('project.completionYear = :year', { year: filters.year });
    if (filters?.featured !== undefined) qb.andWhere('project.featured = :featured', { featured: filters.featured });
    return qb.orderBy('project.completionYear', 'DESC').getMany().then((items) => items.map((p) => this.serialize(p)));
  }

  async findBySlug(slug: string) {
    const project = await this.repo.findOne({ where: { slug } });
    if (!project) throw new NotFoundException('Project not found');
    return this.serialize(project);
  }

  async findById(id: string) {
    const project = await this.repo.findOne({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return this.serialize(project);
  }

  async create(data: ProjectInput) {
    const slug = data.slug?.trim() || this.slugify(data.name.en || data.name.ko);
    const saved = await this.repo.save(this.repo.create(this.normalize(data, slug)));
    return this.serialize(saved);
  }

  async update(id: string, data: Partial<ProjectInput>) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Project not found');
    const slug = data.slug?.trim() || existing.slug;
    await this.repo.update(id, this.normalize(data, slug, existing));
    return this.findById(id);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Project not found');
    return { success: true };
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || `project-${Date.now()}`;
  }

  private normalize(data: Partial<ProjectInput>, slug: string, existing?: Project): Partial<Project> {
    return {
      slug,
      name: data.name ?? existing?.name,
      client: data.client?.trim() ?? existing?.client,
      location: data.location?.trim() ?? existing?.location,
      completionYear: data.completionYear ?? existing?.completionYear,
      scope: data.scope ?? existing?.scope,
      description: data.description ?? existing?.description,
      category: data.category ?? existing?.category,
      industry: data.industry?.trim() ?? existing?.industry ?? '',
      status: data.status ?? existing?.status ?? 'completed',
      images: data.images ?? existing?.images ?? [],
      featured: data.featured ?? existing?.featured ?? false,
    };
  }

  private serialize(project: Project) {
    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      client: project.client,
      location: project.location,
      completionYear: project.completionYear,
      scope: project.scope,
      description: project.description,
      category: project.category,
      industry: project.industry,
      status: project.status,
      images: project.images ?? [],
      featured: project.featured,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
