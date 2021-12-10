import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginTagService } from './pluginTag.service';
import { PluginTagController } from './pluginTag.controller';
import { PluginTag } from '../entities/PluginTag';
import { PluginModule } from '../plugin/plugin.module';

@Module({
  providers: [PluginTagService],
  controllers: [PluginTagController],
  imports: [TypeOrmModule.forFeature([PluginTag]), PluginModule],
})
export class PluginTagModule {}
