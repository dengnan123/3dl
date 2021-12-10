import { Module } from '@nestjs/common';
import { EventsGateway } from './socket';
import { PageCompModule } from '../page-comp/page-comp.module';
import { PageModule } from '../page/page.module';

@Module({
  providers: [EventsGateway],
  imports: [PageCompModule, PageModule],
})
export class EventsModule {}
