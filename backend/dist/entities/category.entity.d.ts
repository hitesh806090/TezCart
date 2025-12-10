export declare class Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    parent: Category;
    parentId: string;
    children: Category[];
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}
