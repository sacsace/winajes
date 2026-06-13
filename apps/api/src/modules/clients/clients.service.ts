import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { CLIENTS_SEED } from '../../data/clients.seed';
import type { ClientCategory, ClientInput } from './client.types';

@Injectable()
export class ClientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0 && CLIENTS_SEED.length > 0) {
      await this.bulkImport(CLIENTS_SEED, false);
    }
  }

  async findAll(category?: ClientCategory) {
    const qb = this.repo.createQueryBuilder('c');
    if (category) {
      qb.andWhere('c.category = :category', { category });
    }
    const items = await qb.orderBy('c.order', 'ASC').addOrderBy('c.name', 'ASC').getMany();
    return items.map((c) => this.serialize(c));
  }

  async findOne(id: string) {
    const client = await this.repo.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return this.serialize(client);
  }

  async create(data: ClientInput) {
    const saved = await this.repo.save(this.repo.create(this.normalize(data)));
    return this.serialize(saved);
  }

  async update(id: string, data: Partial<ClientInput>) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Client not found');
    await this.repo.update(id, this.normalize(data, existing));
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Client not found');
    return { success: true };
  }

  async bulkImport(records: ClientInput[], replace = false) {
    if (replace) {
      await this.repo.clear();
    }
    const entities = records.map((r) => this.repo.create(this.normalize(r)));
    await this.repo.save(entities, { chunk: 50 });
    return { imported: entities.length };
  }

  private normalize(data: Partial<ClientInput>, existing?: Client): Partial<Client> {
    return {
      name: data.name?.trim() ?? existing?.name,
      logo: data.logo ?? existing?.logo ?? '',
      category: data.category ?? existing?.category ?? 'brand',
      order: data.order ?? existing?.order ?? 0,
    };
  }

  private serialize(client: Client) {
    return {
      id: client.id,
      name: client.name,
      logo: client.logo,
      category: client.category as ClientCategory,
      order: client.order,
      createdAt: client.createdAt,
    };
  }
}
