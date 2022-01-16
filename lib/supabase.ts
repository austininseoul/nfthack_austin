import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPBASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPBASE_KEY);
