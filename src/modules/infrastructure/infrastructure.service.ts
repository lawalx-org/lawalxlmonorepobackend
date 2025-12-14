import { Injectable } from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';

@Injectable()
export class InfrastructureService {
  constructor(private readonly repository: InfrastructureRepository) {}
}
