export interface SubModifierOptions {
    subModName: string;
    subNetQty: number;

//   categoryId?: number; //maybe important?
//   isActive: boolean; //important
//   isArchived?: boolean; //important
//   categoryName: string; //important
//   secondLanguageName?: string; //not important
//   description?: string; //not important
//   reference: string; //not important
//   parentCategoryId?: number; //important
//   image?: File | string | null; //important
//   icon?: string; //important
//   backgroundColor: string; // not important
//   withProducts: boolean; //not important
//   withSubCategories: boolean //not important
//   subCategories?: MenuCategories[]; //important
//   schedule: ScheduleEntry[]; // not important
//   item: number; //important
//   webShop: boolean; //important
//   aggregator: boolean; //important
//   kiosk: boolean; //important
//   counterTop: boolean; //important
//   lastOrder?: Date; // not important
//   createdAt: Date; //important
//   lastModified?: Date; //important
}
export interface createSize {
    createName: string;
    Sku: string;
    Price: number;
    Duplicate: string;
    isActive: boolean;
}