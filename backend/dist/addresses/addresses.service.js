"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("../entities/address.entity");
let AddressesService = class AddressesService {
    addressesRepository;
    constructor(addressesRepository) {
        this.addressesRepository = addressesRepository;
    }
    async create(createAddressDto, userId) {
        if (createAddressDto.isDefault) {
            await this.addressesRepository.update({ userId, isDefault: true }, { isDefault: false });
        }
        const address = this.addressesRepository.create({
            ...createAddressDto,
            userId,
        });
        return this.addressesRepository.save(address);
    }
    async findAll(userId) {
        return this.addressesRepository.find({
            where: { userId },
            order: { isDefault: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const address = await this.addressesRepository.findOne({
            where: { id, userId },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return address;
    }
    async getDefault(userId) {
        return this.addressesRepository.findOne({
            where: { userId, isDefault: true },
        });
    }
    async update(id, updateAddressDto, userId) {
        const address = await this.findOne(id, userId);
        if (updateAddressDto.isDefault) {
            await this.addressesRepository.update({ userId, isDefault: true }, { isDefault: false });
        }
        Object.assign(address, updateAddressDto);
        return this.addressesRepository.save(address);
    }
    async setAsDefault(id, userId) {
        const address = await this.findOne(id, userId);
        await this.addressesRepository.update({ userId, isDefault: true }, { isDefault: false });
        address.isDefault = true;
        return this.addressesRepository.save(address);
    }
    async remove(id, userId) {
        const address = await this.findOne(id, userId);
        await this.addressesRepository.remove(address);
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map