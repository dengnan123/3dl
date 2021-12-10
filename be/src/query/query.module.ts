import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';
import { Database } from '../entities/Database'
import { SqlQuery } from '../entities/SqlQuery'

@Module({
  controllers: [QueryController],
  providers: [QueryService],
  imports: [
    TypeOrmModule.forFeature([Database]),
    TypeOrmModule.forFeature([SqlQuery]),
  ]
})
export class QueryModule { }
