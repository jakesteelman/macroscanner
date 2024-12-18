"use server"
import { Database, TablesInsert, TablesUpdate } from "@/database.types"
import { createClient } from "@/utils/supabase/server"
import { getUser } from "./user"

export async function getEntry(id: string) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase
        .from('entries')
        .select('*, photos(*, predictions(*, usda_foods!predictions_fdc_id_fkey(fdc_id,name,kcal,fat,fat_sat,fat_trans,fat_mono,fat_poly,carbs,sugar,sugar_added,fiber,protein,cholesterol,sodium,alcohol,caffeine,density,created_at,updated_at,data_type)))')
        .eq('id', id)
        .order('created_at', { ascending: false })
        .order('created_at', { referencedTable: 'photos', ascending: false })
        .single()

    if (error) throw error

    return data
}

export async function getEntries() {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase
        .from('entries')
        .select('*, photos(*, predictions(*))')
        .order('created_at', { ascending: false })

    if (error) throw error

    return data
}

export async function createBlankEntry(entry: TablesInsert<'entries'>) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase
        .from('entries')
        .insert(entry)
        .select('id')
        .single()

    if (error) throw error

    return data
}

export async function updateEntry(id: string, updates: TablesUpdate<'entries'>) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase.from('entries').update(updates).eq('id', id).single()
    if (error) throw error
    return data
}

export async function deleteEntry(id: string) {
    const supabase = await createClient()
    const user = await getUser()

    const { data, error } = await supabase.from('entries').delete().eq('id', id).single()
    if (error) throw error
    return data
}
