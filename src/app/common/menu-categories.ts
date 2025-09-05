import { SafeUrl } from "@angular/platform-browser";

// This file defines the structure of menu categories used in the application.
export interface MenuCategories {
  categoryId?: number; //maybe important?
  isActive: boolean; //important
  isArchived?: boolean; //important
  categoryName: string; //important
  secondLanguageName?: string; //not important
  description?: string; //not important
  reference: string; //not important
  parentCategoryId?: number; //important
  image?: File | string | null; //important
  icon?: string; //important
  backgroundColor: string; // not important
  withProducts: boolean; //not important
  withSubCategories: boolean //not important
  subCategories?: MenuCategories[]; //important
  schedule: ScheduleEntry[]; // not important
  item: number; //important
  webShop: boolean; //important
  aggregator: boolean; //important
  kiosk: boolean; //important
  counterTop: boolean; //important
  lastOrder?: Date; // not important
  createdAt: Date; //important
  lastModified?: Date; //important
  isTimedActivation?: boolean; //not important
  selectedScheduleMode?: number;
  dateStartOnly?: Date; //not important
  dateActivation?: Date; //not important
  dateDeactivation?: Date; //not important
  //timedActivationRange?: Date[] | null; //not important
  autoActivated?: boolean; //not important
  level? : number
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
  categoryId?: number;
  categoryName: string;
  image: string;
  icon: string;
  level? : number
  parentCategoryId? : number
}

export interface CategoryLevel0 {
  categoryId: number;
  categoryName : string;
  sortNumber: number;
}

export type ToggleableFields =
  | "isActive"
  | "webShop"
  | "aggregator"
  | "kiosk"
  | "counterTop";

