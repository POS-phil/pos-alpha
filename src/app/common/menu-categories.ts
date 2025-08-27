import { SafeUrl } from "@angular/platform-browser";

// This file defines the structure of menu categories used in the application.
export interface MenuCategories {
  categoryId?: number;
  isActive: boolean;
  isDeleted?: boolean;
  categoryName: string;
  secondLanguageName?: string; // Optional for second language support
  description?: string;
  reference: string;
  parentCategoryId?: number; // Optional for subcategories
  image?: File | string | null;
  icon?: string;
  background: string;
  withProducts: boolean;
  withSubCategories: boolean
  subCategories?: MenuCategories[];
  schedule: ScheduleEntry[];
  item: number;
  webShop: boolean;
  aggregator: boolean;
  kiosk: boolean;
  counterTop: boolean;
  lastOrder?: Date;
  createdAt: Date;
}

export interface ScheduleEntry {
  day: string;                
  available: boolean;
  allDay: boolean;
  startTime?: string;         
  endTime?: string;           
  days?: ScheduleEntry[];
}

// export interface categoryFlatNode {
//   expandable: boolean;
//   level : number;
//   categoryId?: number;
//   isActive: boolean;
//   isDeleted?: boolean;
//   categoryName: string;
//   secondLanguageName?: string; // Optional for second language support
//   description?: string;
//   reference: string;
//   parentCategoryId?: number; // Optional for subcategories
//   image?: File | string | null;
//   icon?: string;
//   background: string;
//   withProducts: boolean;
//   withSubCategories: boolean
//   subCategories?: MenuCategories[];
//   schedule: ScheduleEntry[];
//   item: number;
//   webShop: boolean;
//   aggregator: boolean;
//   kiosk: boolean;
//   counterTop: boolean;
//   lastOrder?: Date;
//   createdAt: Date;

// }

