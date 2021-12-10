import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { InitService } from './app.service';
import { QueryModule } from './query/query.module'

@Module({
  imports: [
    HttpModule.register({

    }),
    QueryModule
  ],
  controllers: [AppController],
  providers: [InitService],
})
export class AppModule { }
