import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const URI = process.env.URL_SUPA as string;
const KEY = process.env.URL_KEY as string;

export const supabase = createClient(URI, KEY);
