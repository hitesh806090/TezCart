import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    create(createAddressDto: CreateAddressDto, req: any): Promise<import("../entities/address.entity").Address>;
    findAll(req: any): Promise<import("../entities/address.entity").Address[]>;
    getDefault(req: any): Promise<import("../entities/address.entity").Address | null>;
    findOne(id: string, req: any): Promise<import("../entities/address.entity").Address>;
    update(id: string, updateAddressDto: UpdateAddressDto, req: any): Promise<import("../entities/address.entity").Address>;
    setAsDefault(id: string, req: any): Promise<import("../entities/address.entity").Address>;
    remove(id: string, req: any): Promise<void>;
}
