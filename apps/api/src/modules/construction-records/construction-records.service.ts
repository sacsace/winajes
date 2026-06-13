import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstructionRecord } from '../../entities/construction-record.entity';
import { CONSTRUCTION_RECORDS_SEED } from '../../data/construction-records.seed';

import { ConstructionRecordInput } from './construction-record.types';
export class ConstructionRecordsService implements OnModuleInit {
  constructor(
    @InjectRepository(ConstructionRecord)
    private readonly repo: Repository<ConstructionRecord>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0 && CONSTRUCTION_RECORDS_SEED.length > 0) {
      await this.bulkImport(CONSTRUCTION_RECORDS_SEED, false);
    }
  }

  async findAll(filters?: {
    year?: number;
    client?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters?.limit ?? 50));
    const qb = this.repo.createQueryBuilder('r');

    if (filters?.year) {
      qb.andWhere('EXTRACT(YEAR FROM r.constructionDate) = :year', { year: filters.year });
    }
    if (filters?.client?.trim()) {
      qb.andWhere('LOWER(r.client) LIKE LOWER(:client)', { client: `%${filters.client.trim()}%` });
    }

    qb.orderBy('r.constructionDate', 'DESC').addOrderBy('r.createdAt', 'DESC');

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items: items.map((r) => this.serialize(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findYears() {
    const rows = await this.repo
      .createQueryBuilder('r')
      .select('DISTINCT EXTRACT(YEAR FROM r.constructionDate)', 'year')
      .orderBy('year', 'DESC')
      .getRawMany<{ year: string }>();

    return rows.map((r) => Number(r.year)).filter(Boolean);
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Construction record not found');
    return this.serialize(record);
  }

  async create(data: ConstructionRecordInput) {
    const saved = await this.repo.save(this.repo.create(this.normalize(data)));
    return this.serialize(saved);
  }

  async update(id: string, data: Partial<ConstructionRecordInput>) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Construction record not found');
    await this.repo.update(id, this.normalize(data, existing));
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Construction record not found');
    return { success: true };
  }

  async bulkImport(records: ConstructionRecordInput[], replace = false) {
    if (replace) {
      await this.repo.clear();
    }
    const entities = records.map((r) => this.repo.create(this.normalize(r)));
    await this.repo.save(entities, { chunk: 100 });
    return { imported: entities.length };
  }

  private normalize(
    data: Partial<ConstructionRecordInput>,
    existing?: ConstructionRecord,
  ): Partial<ConstructionRecord> {
    const amount = data.amount !== undefined
      ? String(Math.round(Number(String(data.amount).replace(/,/g, ''))))
      : existing?.amount;

    return {
      constructionDate: data.constructionDate ?? existing?.constructionDate,
      client: data.client?.trim() ?? existing?.client,
      description: data.description?.trim() ?? existing?.description,
      amount,
    };
  }

  private serialize(record: ConstructionRecord) {
    return {
      id: record.id,
      constructionDate: record.constructionDate,
      client: record.client,
      description: record.description,
      amount: record.amount,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
