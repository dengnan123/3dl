import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedashService } from './redash.service';
import { RedashController } from './redash.controller';
import { pgConfig } from '../config/db'
import { Queries } from './entities/Queries'
import { Database } from '../entities/Database'
const entities = [`${__dirname}/redash/entities/**{.ts,.js}`];

@Module({
  controllers: [RedashController],
  providers: [RedashService],
  imports: [
    TypeOrmModule.forFeature([Queries], 'pgConnection'),
    TypeOrmModule.forFeature([Database]),
    HttpModule.register({
      timeout: 40000,
    }),
  ]
})
export class RedashModule { }
