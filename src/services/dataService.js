import { supabase } from '../lib/supabase'

const fail = () => { if (!supabase) throw new Error('DevVault is not configured. Add your Supabase environment variables.') }
export const list = async (table, order = 'created_at', ascending = false) => { fail(); const { data, error } = await supabase.from(table).select('*').order(order, { ascending }); if (error) throw error; return data }
export const create = async (table, values, userId) => { fail(); const { data, error } = await supabase.from(table).insert({ ...values, user_id: userId }).select().single(); if (error) throw error; return data }
export const update = async (table, id, values) => { fail(); const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single(); if (error) throw error; return data }
export const remove = async (table, id) => { fail(); const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error }
