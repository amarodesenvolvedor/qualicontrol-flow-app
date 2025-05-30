
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wnothkrrafozcfajggrz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indub3Roa3JyYWZvemNmYWpnZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDU2MzAsImV4cCI6MjA2MjQ4MTYzMH0.2DVFhz9v2643T4FfzwUl0bPj_ahYSkI3fLlEcNuXWds";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Enhanced Supabase client with improved configuration
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit',
    },
    global: {
      fetch: function customFetch(url, options) {
        return fetch(url, options);
      },
    },
    // Adding retry strategy for network issues
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);
