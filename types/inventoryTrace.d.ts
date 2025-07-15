export interface AmountUnit {
    id: number;
    name: string;
}

export interface FoodIngredient {
    id: number;
    name: string;
    amount_unit_id: number;
    amount_unit: AmountUnit;
}

export interface Supplier {
    id: number;
    name: string;
    email: string;
    phoneno: string;
    address: string;
    companyname: string;
    companyphoneno: string;
    companyaddress: string;
    refcomment: string;
    blacklist: number;
    supplierphotourl: string;
}

export interface InventoryTrace {
    id: number;
    food_ingredient_id: name;
    food_ingredient: FoodIngredient;
    // supplier: name;
    supplier: Supplier;
    quantity: number;
    total_amount: number;
    paid_amount: number;
    event_time: string;
}

// This represents the structure of the API response's 'data' object
export interface InventoryTraceData {
    items: InventoryTrace[];
    total: number;
}

// This represents the full API response
export interface ApiResponse {
    status: boolean;
    data: InventoryTraceData;
}
