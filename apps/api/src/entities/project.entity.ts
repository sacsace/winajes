import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column('jsonb')
  name: { ko: string; en: string };

  @Column()
  client: string;

  @Column()
  location: string;

  @Column()
  completionYear: number;

  @Column('jsonb')
  scope: { ko: string; en: string };

  @Column('jsonb')
  description: { ko: string; en: string };

  @Column()
  category: string;

  @Column()
  industry: string;

  @Column({ default: 'completed' })
  status: string;

  @Column('simple-array', { default: '' })
  images: string[];

  @Column({ default: false })
  featured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
