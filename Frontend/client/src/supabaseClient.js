// /client/src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhssyhfrmzqpyezvfkuh.supabase.co' // Paste your Project URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc3N5aGZybXpxcHllenZma3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODEyOTgsImV4cCI6MjA2OTM1NzI5OH0.PFUWAu_zteaRBNf5aNICWy1NnbZ45CtGom1wgmAriic' // Paste your anon public key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey)