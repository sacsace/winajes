import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
} from 'typeorm';

@Entity('company_info')
export class CompanyInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  name: { ko: string; en: string };

  @Column('jsonb')
  tagline: { ko: string; en: string };

  @Column({ default: 2014 })
  established: number;

  @Column('jsonb')
  ceoMessage: { photo: string; message: { ko: string; en: string }; signature: string };

  @Column('jsonb')
  vision: { ko: string; en: string };

  @Column('jsonb')
  mission: { ko: string; en: string }[];

  @Column('jsonb')
  stats: { yearsExperience: number; projectsCompleted: number; clientsServed: number; engineers: number };

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('offices')
export class Office {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  name: { ko: string; en: string };

  @Column('jsonb')
  address: { ko: string; en: string };

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column({ default: false })
  isHeadquarters: boolean;
}

@Entity('seo_meta')
export class SeoMeta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  page: string;

  @Column()
  locale: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  ogImage: string;
}
