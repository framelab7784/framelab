import { createClient } from '@supabase/supabase-js';

// PERINGATAN: Ini adalah nilai placeholder.
// Ganti dengan URL proyek Supabase dan Kunci Anon Publik Anda yang sebenarnya.
// Untuk produksi, sangat disarankan untuk menggunakan environment variables.
// FIX: Explicitly type as string to allow comparison with placeholder values without a compile-time error.
const supabaseUrl: string = 'https://llheehdsagdqkifwpuen.supabase.co';
// FIX: Explicitly type as string to allow comparison with placeholder values without a compile-time error.
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsaGVlaGRzYWdkcWtpZndwdWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDM0MzQsImV4cCI6MjA3NDk3OTQzNH0.U1iJVM5glsWzYIzQlC6c2yope0RS6aRyvOK1zKCQYrM';

if (!supabaseUrl || supabaseUrl === 'https://your-project-id.supabase.co') {
    console.error("URL Supabase belum dikonfigurasi. Silakan ganti placeholder di lib/supabaseClient.ts");
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-public-key') {
    console.error("Kunci Anon Supabase belum dikonfigurasi. Silakan ganti placeholder di lib/supabaseClient.ts");
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey);