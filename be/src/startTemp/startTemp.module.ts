import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartTempService } from './startTemp.service';
import { StartTempController } from './startTemp.controller';
import { StartTemp } from '../entities/StartTemp';

@Module({
  providers: [StartTempService],
  controllers: [StartTempController],
  imports: [TypeOrmModule.forFeature([StartTemp])],
})
export class StartTempModule {}
