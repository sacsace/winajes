import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstructionRecord } from '../../entities/construction-record.entity';
import { ConstructionRecordsController } from './construction-records.controller';
import { ConstructionRecordsService } from './construction-records.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConstructionRecord])],
  controllers: [ConstructionRecordsController],
  providers: [ConstructionRecordsService],
  exports: [ConstructionRecordsService],
})
export class ConstructionRecordsModule {}
