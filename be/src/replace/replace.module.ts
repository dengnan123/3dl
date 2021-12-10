import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplaceService } from './replace.service';
import { ReplaceController } from './replace.controller';
import { Replace } from '../entities/Replace';

@Module({
  providers: [ReplaceService],
  controllers: [ReplaceController],
  imports: [TypeOrmModule.forFeature([Replace])],
})
export class ReplaceModule {}
