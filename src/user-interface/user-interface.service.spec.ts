import { Test, TestingModule } from '@nestjs/testing';
import { UserInterfaceService } from './user-interface.service';

describe('UserInterfaceService', () => {
  let service: UserInterfaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInterfaceService],
    }).compile();

    service = module.get<UserInterfaceService>(UserInterfaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
