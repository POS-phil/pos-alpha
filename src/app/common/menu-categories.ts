export interface MenuCategories {
    category_name: string;
    image?: File | string;
    reference: number;
    schedule: string;
    item: number;
    web_shop: boolean;
    aggregator: boolean;
    kiosk: boolean;
    last_order: Date;
    created_at: Date;
}
