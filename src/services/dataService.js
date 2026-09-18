import { getSupabase } from '../lib/supabase'

export const list = async (table, order = 'created_at', ascending = false) => { const { data, error } = await getSupabase().from(table).select('*').order(order, { ascending }); if (error) throw error; return data }
export const create = async (table, values, userId) => { const { data, error } = await getSupabase().from(table).insert({ ...values, user_id: userId }).select().single(); if (error) throw error; return data }
export const update = async (table, id, values) => { const { data, error } = await getSupabase().from(table).update(values).eq('id', id).select().single(); if (error) throw error; return data }
export const remove = async (table, id) => { const { error } = await getSupabase().from(table).delete().eq('id', id); if (error) throw error }
