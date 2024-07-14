
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aufrdxctzmpaczegvyeu.supabase.co'; // Replace with your actual Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZnJkeGN0em1wYWN6ZWd2eWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MDAxMjQsImV4cCI6MjAzNjQ3NjEyNH0.l60Fvw7n8Fzg04VCB-tEfowuNwicvkkkWi-hfRqgdE8'; // Replace with your actual Supabase anon key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
















