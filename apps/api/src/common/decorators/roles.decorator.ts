import { SetMetadata } from '@nestjs/common';

// In a real application, you might define an enum or literal type for UserPersona
// that matches the values in User.defaultPersona
type UserPersona = 'customer' | 'seller' | 'delivery_partner' | 'admin' | 'super_admin';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserPersona[]) => SetMetadata(ROLES_KEY, roles);