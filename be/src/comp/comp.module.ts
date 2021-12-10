import { Module } from '@nestjs/common';
import { CompService } from './comp.service';
import { CompController } from './comp.controller';
import { Comp } from '../entities/Comp';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CompService],
  controllers: [CompController],
  imports: [TypeOrmModule.forFeature([Comp])],
})
export class CompModule {}
