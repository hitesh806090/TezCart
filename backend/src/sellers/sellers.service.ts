import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { User } from '../users/entities/user.entity';
import { CreateSellerDto } from './dto/create-seller.dto';
import { SellerStatus } from './entities/seller-status.enum';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  async create(createSellerDto: CreateSellerDto, user: User): Promise<Seller> {
    const seller = this.sellersRepository.create({
      storeName: createSellerDto.storeName,
      description: createSellerDto.description,
      gstin: createSellerDto.gstin,
      pickupAddress: createSellerDto.pickupAddress,
      user: user,
      userId: user.id,
      status: SellerStatus.PENDING,
    });
    return this.sellersRepository.save(seller);
  }

  async findAllPendingSellers(): Promise<Seller[]> {
    return this.sellersRepository.find({
      where: { status: SellerStatus.PENDING },
      relations: ['user'], // Load user information
    });
  }

  async approveSeller(id: string): Promise<Seller> {
    const seller = await this.sellersRepository.preload({ id, status: SellerStatus.APPROVED });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }
    return this.sellersRepository.save(seller);
  }

  async rejectSeller(id: string): Promise<Seller> {
    const seller = await this.sellersRepository.preload({ id, status: SellerStatus.REJECTED });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }
    return this.sellersRepository.save(seller);
  }
}
