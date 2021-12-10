import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadingService } from './loading.service';
import { LoadingController } from './loading.controller';
import { Loading } from '../entities/Loading';

@Module({
  providers: [LoadingService],
  controllers: [LoadingController],
  imports: [TypeOrmModule.forFeature([Loading])],
})
export class LoadingModule {}
