import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from 'db';

class CreditWalletDto {
  amount: number;
  transactionType: string;
  description: string;
  referenceId?: string;
  orderId?: string;
}

class DebitWalletDto {
  amount: number;
  transactionType: string;
  description: string;
  referenceId?: string;
  orderId?: string;
}

@ApiTags('Wallet')
@Controller('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // All wallet operations require authentication
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('my-wallet')
  @HttpCode(HttpStatus.OK)
  async getMyWallet(@Request() req: { user: User }) {
    return this.walletService.getWallet(req.user.id);
  }

  @Get('my-transactions')
  @HttpCode(HttpStatus.OK)
  async getMyTransactions(@Request() req: { user: User }) {
    return this.walletService.getWalletTransactions(req.user.id);
  }

  // Admin endpoints for crediting/debiting wallets (for refunds, adjustments, etc.)
  @Post('admin/credit/:userId')
  @UseGuards(RolesGuard) // Assuming RolesGuard is defined elsewhere
  @Roles('admin', 'super_admin') // Only admins can credit/debit wallets
  @HttpCode(HttpStatus.OK)
  async adminCreditWallet(@Param('userId') userId: string, @Body() creditDto: CreditWalletDto) {
    return this.walletService.creditWallet(
      userId,
      creditDto.amount,
      creditDto.transactionType,
      creditDto.description,
      creditDto.referenceId,
      creditDto.orderId,
    );
  }

  @Post('admin/debit/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async adminDebitWallet(@Param('userId') userId: string, @Body() debitDto: DebitWalletDto) {
    return this.walletService.debitWallet(
      userId,
      debitDto.amount,
      debitDto.transactionType,
      debitDto.description,
      debitDto.referenceId,
      debitDto.orderId,
    );
  }
}