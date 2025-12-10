import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    // Self-referencing for parent-child relationship (subcategories)
    @ManyToOne(() => Category, category => category.children, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parentId' })
    parent: Category;

    @Column({ nullable: true })
    parentId: string;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: 0 })
    displayOrder: number; // For sorting categories

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
