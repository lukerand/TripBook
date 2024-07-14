// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aufrdxctzmpaczegvyeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1ZnJkeGN0em1wYWN6ZWd2eWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA5MDAxMjQsImV4cCI6MjAzNjQ3NjEyNH0.l60Fvw7n8Fzg04VCB-tEfowuNwicvkkkWi-hfRqgdE8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
