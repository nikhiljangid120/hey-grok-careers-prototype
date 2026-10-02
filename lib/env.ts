const hasSupabase =
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const serverEnv = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  resumeBucket: process.env.SUPABASE_RESUME_BUCKET || "resumes",
  demoMode: process.env.DEMO_MODE === "true" && !hasSupabase,
  hasSupabase,
};