import { SafeUrl } from "@angular/platform-browser";

// This file defines the structure of menu categories used in the application.
export interface MenuCategories {
    categoryId?: number;
    active: boolean;
    deleted?: boolean;
    categoryName: string;
    secondLanguageName?: string; // Optional for second language support
    description? : string; 
    reference: string;
    parentCategoryId?: number; // Optional for subcategories
    image?: File | string | null; 
    icon?: string;
    background : string;
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

// Update new interface for schedule entries
// This interface defines the structure of a schedule entry for menu categories
export interface ScheduleEntry {
  day: string;                // 'monday', 'tuesday', ...
  available: boolean;
  allDay: boolean;
  startTime?: string;         // '08:00'
  endTime?: string;           // '17:00'
  //days?: ScheduleEntry[]; // Removed to fix circular reference
}

