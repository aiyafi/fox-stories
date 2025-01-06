// utils/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Ensure that these environment variables are set in your .env.local file
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

// Create a Supabase client with the Database type for type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
