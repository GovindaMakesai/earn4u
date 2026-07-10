import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import {
  Wallet,
  Transaction,
  CoinPackage,
  TransactionType,
  Currency,
  TransactionCategory,
} from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(CoinPackage)
    private coinPackageRepo: Repository<CoinPackage>,
    private dataSource: DataSource,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Wallet not found',
      });
    }
    return wallet;
  }

  async getTransactions(
    userId: string,
    page = 1,
    limit = 20,
    currency?: Currency,
    category?: TransactionCategory,
  ) {
    const wallet = await this.getWallet(userId);
    const query = this.transactionRepo
      .createQueryBuilder('tx')
      .where('tx.wallet_id = :walletId', { walletId: wallet.id })
      .orderBy('tx.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (currency) query.andWhere('tx.currency = :currency', { currency });
    if (category) query.andWhere('tx.category = :category', { category });

    const [data, total] = await query.getManyAndCount();
    return { data, meta: { page, limit, total } };
  }

  async getCoinPackages(platform?: string): Promise<CoinPackage[]> {
    const query = this.coinPackageRepo
      .createQueryBuilder('pkg')
      .where('pkg.is_active = true')
      .orderBy('pkg.sort_order', 'ASC');

    if (platform) {
      query.andWhere('(pkg.platform = :platform OR pkg.platform = :all)', {
        platform,
        all: 'all',
      });
    }

    return query.getMany();
  }

  async debit(
    userId: string,
    currency: Currency,
    amount: number,
    category: TransactionCategory,
    idempotencyKey: string,
    referenceType?: string,
    referenceId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    if (amount <= 0) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_ERROR',
        message: 'Amount must be positive',
      });
    }

    const existing = await this.transactionRepo.findOne({
      where: { idempotencyKey },
    });
    if (existing) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Duplicate transaction',
      });
    }

    return this.dataSource.transaction((manager) =>
      this.applyDebit(
        manager,
        userId,
        currency,
        amount,
        category,
        idempotencyKey,
        referenceType,
        referenceId,
        metadata,
      ),
    );
  }

  async credit(
    userId: string,
    currency: Currency,
    amount: number,
    category: TransactionCategory,
    idempotencyKey: string,
    referenceType?: string,
    referenceId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    const existing = await this.transactionRepo.findOne({
      where: { idempotencyKey },
    });
    if (existing) {
      throw new ConflictException({
        code: 'CONFLICT',
        message: 'Duplicate transaction',
      });
    }

    return this.dataSource.transaction((manager) =>
      this.applyCredit(
        manager,
        userId,
        currency,
        amount,
        category,
        idempotencyKey,
        referenceType,
        referenceId,
        metadata,
      ),
    );
  }

  async transferGiftFunds(
    params: {
      senderId: string;
      receiverId: string;
      coinAmount: number;
      diamondAmount: number;
      debitIdempotencyKey: string;
      creditIdempotencyKey: string;
      giftId: string;
      metadata?: Record<string, unknown>;
    },
    manager?: EntityManager,
  ): Promise<{ debitTx: Transaction; creditTx: Transaction }> {
    const execute = async (m: EntityManager) => {
      const { transaction: debitTx } = await this.applyDebit(
        m,
        params.senderId,
        Currency.COINS,
        params.coinAmount,
        TransactionCategory.GIFT_SENT,
        params.debitIdempotencyKey,
        'gift',
        params.giftId,
        { ...params.metadata, receiverId: params.receiverId },
      );

      const { transaction: creditTx } = await this.applyCredit(
        m,
        params.receiverId,
        Currency.DIAMONDS,
        params.diamondAmount,
        TransactionCategory.GIFT_RECEIVED,
        params.creditIdempotencyKey,
        'gift',
        params.giftId,
        {
          ...params.metadata,
          senderId: params.senderId,
          coinAmount: params.coinAmount,
        },
      );

      return { debitTx, creditTx };
    };

    if (manager) {
      return execute(manager);
    }

    const existingDebit = await this.transactionRepo.findOne({
      where: { idempotencyKey: params.debitIdempotencyKey },
    });
    if (existingDebit) {
      const existingCredit = await this.transactionRepo.findOne({
        where: { idempotencyKey: params.creditIdempotencyKey },
      });
      if (!existingCredit) {
        throw new UnprocessableEntityException({
          code: 'INCONSISTENT_STATE',
          message: 'Partial gift transaction detected — contact support',
        });
      }
      return { debitTx: existingDebit, creditTx: existingCredit };
    }

    return this.dataSource.transaction(execute);
  }

  private async applyDebit(
    manager: EntityManager,
    userId: string,
    currency: Currency,
    amount: number,
    category: TransactionCategory,
    idempotencyKey: string,
    referenceType?: string,
    referenceId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    if (amount <= 0) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_ERROR',
        message: 'Amount must be positive',
      });
    }

    const wallet = await manager.findOne(Wallet, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Wallet not found',
      });
    }

    const currentBalance = this.getBalance(wallet, currency);
    if (currentBalance < amount) {
      throw new UnprocessableEntityException({
        code: 'INSUFFICIENT_BALANCE',
        message: 'Insufficient balance',
      });
    }

    const balanceAfter = currentBalance - amount;
    this.setBalance(wallet, currency, balanceAfter);
    await manager.save(wallet);

    const transaction = manager.create(Transaction, {
      walletId: wallet.id,
      type: TransactionType.DEBIT,
      currency,
      amount,
      balanceAfter,
      category,
      referenceType,
      referenceId,
      metadata,
      idempotencyKey,
    });
    await manager.save(transaction);

    return { wallet, transaction };
  }

  private async applyCredit(
    manager: EntityManager,
    userId: string,
    currency: Currency,
    amount: number,
    category: TransactionCategory,
    idempotencyKey: string,
    referenceType?: string,
    referenceId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<{ wallet: Wallet; transaction: Transaction }> {
    if (amount <= 0) {
      throw new UnprocessableEntityException({
        code: 'VALIDATION_ERROR',
        message: 'Amount must be positive',
      });
    }

    const wallet = await manager.findOne(Wallet, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!wallet) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: 'Wallet not found',
      });
    }

    const balanceAfter = this.getBalance(wallet, currency) + amount;
    this.setBalance(wallet, currency, balanceAfter);
    await manager.save(wallet);

    const transaction = manager.create(Transaction, {
      walletId: wallet.id,
      type: TransactionType.CREDIT,
      currency,
      amount,
      balanceAfter,
      category,
      referenceType,
      referenceId,
      metadata,
      idempotencyKey,
    });
    await manager.save(transaction);

    return { wallet, transaction };
  }

  private getBalance(wallet: Wallet, currency: Currency): number {
    switch (currency) {
      case Currency.COINS:
        return Number(wallet.coinsBalance);
      case Currency.DIAMONDS:
        return Number(wallet.diamondsBalance);
      case Currency.REWARD_POINTS:
        return Number(wallet.rewardPointsBalance);
    }
  }

  private setBalance(wallet: Wallet, currency: Currency, amount: number): void {
    switch (currency) {
      case Currency.COINS:
        wallet.coinsBalance = amount;
        break;
      case Currency.DIAMONDS:
        wallet.diamondsBalance = amount;
        break;
      case Currency.REWARD_POINTS:
        wallet.rewardPointsBalance = amount;
        break;
    }
  }
}
