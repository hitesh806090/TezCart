import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from './user.entity';

export enum AddressType {
    HOME = 'home',
    WORK = 'work',
    OTHER = 'other',
}

@Entity('addresses')
@Index(['userId'])
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({ type: 'enum', enum: AddressType, default: AddressType.HOME })
    type: AddressType;

    @Column()
    fullName: string;

    @Column()
    phone: string;

    @Column()
    addressLine1: string;

    @Column({ nullable: true })
    addressLine2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    postalCode: string;

    @Column({ default: 'USA' })
    country: string;

    @Column({ default: false })
    isDefault: boolean;

    @Column({ type: 'text', nullable: true })
    instructions: string; // Delivery instructions

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
