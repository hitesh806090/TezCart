import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from 'db'; // Import AuditLog entity

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async createAuditLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(logData);
    return this.auditLogRepository.save(auditLog);
  }

  // Optionally, methods to find/filter audit logs could be added here
}