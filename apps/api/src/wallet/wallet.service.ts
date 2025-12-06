import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Wallet } from 'db';
import { WalletTransaction } from 'db';
import { TenantProvider } from '..//common/tenant.module';
import { UserService } from '../user/user.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly walletTransactionRepository: Repository<WalletTransaction>,
    private readonly tenantProvider: TenantProvider,
    private readonly userService: UserService,
    private readonly entityManager: EntityManager,
  ) {}

  private get tenantId(): string {
    const tenantId = this.tenantProvider.tenantId;
    if (!tenantId) {
      throw new Error('Tenant context missing.');
    }
    return tenantId;
  }

  async getOrCreateWallet(userId: string, currency: string = 'INR'): Promise<Wallet> {
    let wallet = await this.walletRepository.findOne({ where: { userId, tenantId: this.tenantId } });
    if (!wallet) {
      wallet = this.walletRepository.create({
        userId,
        tenantId: this.tenantId,
        balance: 0,
        currency,
        isActive: true,
      });
      await this.walletRepository.save(wallet);
      this.logger.log(`Created new wallet for user ${userId} in tenant ${this.tenantId}`);
    }
    return wallet;
  }

  async creditWallet(
    userId: string,
    amount: number,
    transactionType: string,
    description: string,
    referenceId?: string,
    orderId?: string,
  ): Promise<WalletTransaction> {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be positive.');
    }

    return this.entityManager.transaction(async transactionalEntityManager => {
      const wallet = await transactionalEntityManager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('for_update') // Pessimistic lock for concurrency
        .where('wallet.userId = :userId', { userId })
        .andWhere('wallet.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!wallet) {
        throw new NotFoundException(`Wallet not found for user ${userId}.`);
      }
      if (!wallet.isActive) {
        throw new BadRequestException('Wallet is inactive.');
      }

      wallet.balance += amount;
      await transactionalEntityManager.save(wallet);

      const transaction = transactionalEntityManager.create(WalletTransaction, {
        walletId: wallet.id,
        tenantId: this.tenantId,
        amount,
        transactionType,
        description,
        status: 'completed',
        referenceId,
        orderId,
      });
      await transactionalEntityManager.save(transaction);
      this.logger.log(`Credited ${amount} to wallet ${wallet.id} (user ${userId}). New balance: ${wallet.balance}`);
      return transaction;
    });
  }

  async debitWallet(
    userId: string,
    amount: number,
    transactionType: string,
    description: string,
    referenceId?: string,
    orderId?: string,
  ): Promise<WalletTransaction> {
    if (amount <= 0) {
      throw new BadRequestException('Debit amount must be positive.');
    }

    return this.entityManager.transaction(async transactionalEntityManager => {
      const wallet = await transactionalEntityManager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('for_update') // Pessimistic lock for concurrency
        .where('wallet.userId = :userId', { userId })
        .andWhere('wallet.tenantId = :tenantId', { tenantId: this.tenantId })
        .getOne();

      if (!wallet) {
        throw new NotFoundException(`Wallet not found for user ${userId}.`);
      }
      if (!wallet.isActive) {
        throw new BadRequestException('Wallet is inactive.');
      }
      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient wallet balance.');
      }

      wallet.balance -= amount;
      await transactionalEntityManager.save(wallet);

      const transaction = transactionalEntityManager.create(WalletTransaction, {
        walletId: wallet.id,
        tenantId: this.tenantId,
        amount: -amount, // Store as negative for debit
        transactionType,
        description,
        status: 'completed',
        referenceId,
        orderId,
      });
      await transactionalEntityManager.save(transaction);
      this.logger.log(`Debited ${amount} from wallet ${wallet.id} (user ${userId}). New balance: ${wallet.balance}`);
      return transaction;
    });
  }

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { userId, tenantId: this.tenantId },
      relations: ['transactions'],
      order: { transactions: { createdAt: 'DESC' } },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${userId}.`);
    }
    return wallet;
  }

  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    const wallet = await this.walletRepository.findOne({ where: { userId, tenantId: this.tenantId } });
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ${userId}.`);
    }
    return this.walletTransactionRepository.find({
      where: { walletId: wallet.id, tenantId: this.tenantId },
      order: { createdAt: 'DESC' },
    });
  }
}