import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Deanna Day Spa" }] }),
  component: AdminLogin,
});

const BLUE = "#1DA1F2";
const CREAM = "#FDFCF0";
const BORDER = "rgba(29,161,242,0.18)";

function AdminLogin() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) navigate({ to: "/admin" });
  }, [session, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setError(
          "Account created. Check your email to confirm, then sign in. Once you have your admin account, ask Lovable to disable new signups.",
        );
        setMode("signin");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: CREAM }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: CREAM }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border p-6 sm:p-8 shadow-sm"
        style={{ borderColor: BORDER }}
      >
        <h1 className="text-2xl font-bold text-center" style={{ color: BLUE }}>
          {mode === "signin" ? "Admin Sign In" : "Create Admin Account"}
        </h1>
        <p className="text-sm text-neutral-600 text-center mt-1">
          Manage Deanna Day Spa vacancies
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2"
              style={{ borderColor: BORDER }}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 outline-none focus:ring-2"
              style={{ borderColor: BORDER }}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 rounded-full text-white font-semibold disabled:opacity-60"
            style={{ backgroundColor: BLUE }}
          >
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setMode(mode === "signin" ? "signup" : "signin");
          }}
          className="mt-4 w-full text-sm text-neutral-600 hover:underline"
        >
          {mode === "signin"
            ? "First time? Create an admin account"
            : "Already have an account? Sign in"}
        </button>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-neutral-500 hover:underline"
        >
          ← Back to vacancies
        </Link>
      </div>
    </div>
  );
}
