import { Module } from '@nestjs/common';
import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeColor } from '../entities/ThemeColor';
import { ThemeConfig } from '../entities/ThemeConfig';
@Module({
  providers: [ThemeService],
  controllers: [ThemeController],
  imports: [TypeOrmModule.forFeature([ThemeColor, ThemeConfig])],
  exports: [ThemeService],
})
export class ThemeModule {}
