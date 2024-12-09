"use server"
import { Database } from "@/database.types"
import { createClient } from "@/utils/supabase/server"

export async function getUser() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        throw authError
    }

    if (!user) {
        throw new Error('User not found')
    }

    return user
}