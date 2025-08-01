/// src/app/common/menu-categories.ts
// This file defines the structure of menu categories used in the application.
export interface MenuCategories {
    category_name: string;
    image?: File | string;
    reference: number;
    schedule: ScheduleEntry[];
    item: number;
    web_shop: boolean;
    aggregator: boolean;
    kiosk: boolean;
    last_order: Date;
    created_at: Date;
}

// Update new interface for schedule entries
// This interface defines the structure of a schedule entry for menu categories
export interface ScheduleEntry {
  day: string;                // 'monday', 'tuesday', ...
  available: boolean;
  allDay: boolean;
  startTime?: string;         // '08:00'
  endTime?: string;           // '17:00'
}

