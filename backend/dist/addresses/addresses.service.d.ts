import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesService {
    private addressesRepository;
    constructor(addressesRepository: Repository<Address>);
    create(createAddressDto: CreateAddressDto, userId: string): Promise<Address>;
    findAll(userId: string): Promise<Address[]>;
    findOne(id: string, userId: string): Promise<Address>;
    getDefault(userId: string): Promise<Address | null>;
    update(id: string, updateAddressDto: UpdateAddressDto, userId: string): Promise<Address>;
    setAsDefault(id: string, userId: string): Promise<Address>;
    remove(id: string, userId: string): Promise<void>;
}
