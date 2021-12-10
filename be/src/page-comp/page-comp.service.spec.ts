import { Test, TestingModule } from '@nestjs/testing';
import { PageCompService } from './page-comp.service';

describe('PageCompService', () => {
  let service: PageCompService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageCompService],
    }).compile();

    service = module.get<PageCompService>(PageCompService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
