import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateSellerDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  gstin?: string;

  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

}
