import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const rawUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!rawUrl || !anon) {
  console.error("Missing Supabase URL or anon key in .env (VITE_ prefixed or legacy names are both supported)");
  process.exit(1);
}

// Normalize URL: remove trailing /rest/v1 or /rest/v1/
const url = rawUrl.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
console.log("Using Supabase URL:", url);

const supabase = createClient(url, anon);

(async () => {
  try {
    const { data, error } = await supabase.from("movies").select("*").limit(5);
    if (error) {
      console.error("Supabase query error:", error);
      process.exit(2);
    }
    console.log("Supabase returned rows count:", Array.isArray(data) ? data.length : 0);
    console.dir(data, { depth: 2 });
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("No visible rows from the browser client. Re-run sql/supabase_movies.sql in Supabase SQL Editor so RLS policies are applied, then refresh the page.");
    }
  } catch (e) {
    console.error("Exception while querying Supabase:", e);
    process.exit(3);
  }
})();
