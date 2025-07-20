import { Test, TestingModule } from '@nestjs/testing';
import { ContentTypesController } from './content_types.controller';

describe('ContentTypesController', () => {
  let controller: ContentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentTypesController],
    }).compile();

    controller = module.get<ContentTypesController>(ContentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
