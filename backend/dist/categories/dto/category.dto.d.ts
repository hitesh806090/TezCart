export declare class CreateCategoryDto {
    name: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    displayOrder?: number;
    isActive?: boolean;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string;
    displayOrder?: number;
    isActive?: boolean;
}
