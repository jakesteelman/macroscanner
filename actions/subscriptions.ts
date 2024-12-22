"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getSubscription = cache(async () => {

    const supabase = await createClient();

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .maybeSingle();

    return subscription;
});

export const getProducts = cache(async () => {

    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from('products')
        .select('*, prices(*)')
        .eq('active', true)
        .eq('prices.active', true)
        .order('metadata->index')
        .order('unit_amount', { referencedTable: 'prices' });

    return products;
});

export const getProProduct = cache(async () => {

    const supabase = await createClient();

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('name', 'Macroscanner Pro')
        .eq('active', true)
        .maybeSingle();

    return product;
});