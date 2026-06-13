import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Inquiry } from './entities/inquiry.entity';
import { Client } from './entities/client.entity';
import { NewsArticle } from './entities/news-article.entity';
import { CompanyInfo, Office, SeoMeta } from './entities/company.entity';
import { AuthModule } from './modules/auth/auth.module';
import { InquiriesModule } from './modules/inquiries/inquiries.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ConstructionRecordsModule } from './modules/construction-records/construction-records.module';
import { ClientsModule } from './modules/clients/clients.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ConstructionRecord } from './entities/construction-record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'winajes',
      password: process.env.DB_PASSWORD || 'winajes_dev_password',
      database: process.env.DB_NAME || 'winajes',
      entities: [User, Project, Inquiry, Client, NewsArticle, CompanyInfo, Office, SeoMeta, ConstructionRecord],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    InquiriesModule,
    ProjectsModule,
    ConstructionRecordsModule,
    ClientsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
