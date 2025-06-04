import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lwrfrmcykchxmsrfhimr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3cmZybWN5a2NoeG1zcmZoaW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTUxMTMsImV4cCI6MjA2NDU3MTExM30.7HYZItkrt_dxHo4UojVAQi7YbA7AEOhYTjoZQBlL6-4";

export const supabase = createClient(supabaseUrl, supabaseKey);