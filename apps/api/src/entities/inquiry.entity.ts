import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  company: string;

  @Column({ default: '' })
  country: string;

  @Column()
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  projectType: string;

  @Column('text')
  message: string;

  @Column({ default: 'new' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
