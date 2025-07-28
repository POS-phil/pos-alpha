export interface TransactionOrders {
    refference: number;
    number: number;
    check_number: number;
    store: string;
    customer?: string;
    status: string;
    source: string;
    app_name?: string;
    total: number;
    order_type: string;
    delivery_status: string;
    bussiness_date: Date;
    opened_at: Date;
}
