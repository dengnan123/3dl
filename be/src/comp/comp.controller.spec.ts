import { Test, TestingModule } from '@nestjs/testing';
import { CompController } from './comp.controller';

describe('Comp Controller', () => {
  let controller: CompController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompController],
    }).compile();

    controller = module.get<CompController>(CompController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
