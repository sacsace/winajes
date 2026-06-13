import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column('jsonb')
  title: { ko: string; en: string };

  @Column('jsonb')
  excerpt: { ko: string; en: string };

  @Column('jsonb')
  content: { ko: string; en: string };

  @Column()
  category: string;

  @Column('simple-array', { default: '' })
  tags: string[];

  @Column({ default: '' })
  image: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publishedAt: Date;

  @Column('jsonb', { nullable: true })
  seoTitle: { ko: string; en: string };

  @Column('jsonb', { nullable: true })
  seoDescription: { ko: string; en: string };

  @CreateDateColumn()
  createdAt: Date;
}
