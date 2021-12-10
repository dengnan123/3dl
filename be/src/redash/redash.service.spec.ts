import { Test, TestingModule } from '@nestjs/testing';
import { RedashService } from './redash.service';

describe('RedashService', () => {
  let service: RedashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedashService],
    }).compile();

    service = module.get<RedashService>(RedashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
