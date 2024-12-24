import { Tables } from "@/types/database.types";

export type Subscription = Tables<'subscriptions'>;
export type Product = Tables<'products'>;
export type Price = Tables<'prices'>;

export interface ProductWithPrices extends Product {
    prices: Price[];
}

export interface PriceWithProduct extends Price {
    products: Product | null;
}

export interface SubscriptionWithProduct extends Subscription {
    prices: PriceWithProduct | null;
}

export type BillingInterval = 'lifetime' | 'year' | 'month';