import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { InitService } from './app.service';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController],
  providers: [InitService],
})
export class AppModule {}
