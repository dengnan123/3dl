import { Test, TestingModule } from '@nestjs/testing';
import { RedashController } from './redash.controller';
import { RedashService } from './redash.service';

describe('RedashController', () => {
  let controller: RedashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedashController],
      providers: [RedashService],
    }).compile();

    controller = module.get<RedashController>(RedashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
