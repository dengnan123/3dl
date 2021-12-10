import { Test, TestingModule } from '@nestjs/testing';
import { PageCompController } from './page-comp.controller';

describe('PageComp Controller', () => {
  let controller: PageCompController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageCompController],
    }).compile();

    controller = module.get<PageCompController>(PageCompController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
