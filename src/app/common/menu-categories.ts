import { SafeUrl } from "@angular/platform-browser";

// This file defines the structure of menu categories used in the application.
export interface MenuCategories {
  categoryId?: number;
  isActive: boolean;
  isArchived?: boolean;
  categoryName: string;
  secondLanguageName?: string;
  description?: string;
  reference: string;
  parentCategoryId?: number;
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
  selected?: boolean;
}

export interface ScheduleEntry {
  day: string;                
  available: boolean;
  allDay: boolean;
  startTime?: string;         
  endTime?: string;           
  days?: ScheduleEntry[];
}

export interface CategoryIdAndName {
  categoryId: number;
  categoryName: string;
  image: string;
  icon: string;
}


export type ToggleableFields =
  | "isActive"
  | "webShop"
  | "aggregator"
  | "kiosk"
  | "counterTop";

