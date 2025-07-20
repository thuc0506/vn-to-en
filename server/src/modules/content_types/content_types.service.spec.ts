import { Test, TestingModule } from '@nestjs/testing';
import { ContentTypesService } from './content_types.service';

describe('ContentTypesService', () => {
  let service: ContentTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentTypesService],
    }).compile();

    service = module.get<ContentTypesService>(ContentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
