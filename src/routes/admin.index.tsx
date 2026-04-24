import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LogOut, Plus, Pencil, Trash2, Loader2, Upload, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Vacancy } from "@/lib/vacancy";
import { formatDate } from "@/lib/vacancy";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — Vacancies" }] }),
  component: AdminDashboard,
});

const BLUE = "#1DA1F2";
const CREAM = "#FDFCF0";
const BORDER = "rgba(29,161,242,0.18)";

type Editing = Partial<Vacancy> & {
  responsibilities_text?: string;
  benefits_text?: string;
};

function emptyVacancy(): Editing {
  return {
    slug: "",
    title: "",
    intro: "",
    long_intro: "",
    type: "Full-time",
    experience: "",
    reports_to: "",
    salary: "",
    posted_at: new Date().toISOString().slice(0, 10),
    closes_at: null,
    status: "open",
    responsibilities_text: "",
    benefits_text: "",
    location: "Deanna Day Spa, Seminyak, Bali",
    department: "Spa",
    cover_image_url: null,
    sort_order: 0,
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AdminDashboard() {
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !session) navigate({ to: "/admin/login" });
  }, [authLoading, session, navigate]);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vacancies")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (!error && data) setVacancies(data as Vacancy[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (session) reload();
  }, [session, reload]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const startNew = () => setEditing(emptyVacancy());

  const startEdit = (v: Vacancy) =>
    setEditing({
      ...v,
      responsibilities_text: v.responsibilities.join("\n"),
      benefits_text: v.benefits.join("\n"),
    });

  const handleDelete = async (v: Vacancy) => {
    if (!confirm(`Delete "${v.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("vacancies").delete().eq("id", v.id);
    if (error) {
      alert(error.message);
      return;
    }
    reload();
  };

  const handleUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("vacancy-covers")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("vacancy-covers").getPublicUrl(path);
      setEditing({ ...editing, cover_image_url: data.publicUrl });
    } catch (err: any) {
      setError(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        slug: editing.slug || slugify(editing.title ?? ""),
        title: editing.title ?? "",
        intro: editing.intro ?? "",
        long_intro: editing.long_intro ?? "",
        type: editing.type ?? "Full-time",
        experience: editing.experience ?? "",
        reports_to: editing.reports_to ?? "",
        salary: editing.salary ?? "",
        posted_at: editing.posted_at ?? new Date().toISOString().slice(0, 10),
        closes_at: editing.closes_at || null,
        status: (editing.status as "open" | "closed") ?? "open",
        responsibilities: (editing.responsibilities_text ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: (editing.benefits_text ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        location: editing.location ?? "",
        department: editing.department ?? "Spa",
        cover_image_url: editing.cover_image_url || null,
        sort_order: Number(editing.sort_order ?? 0),
      };

      if (editing.id) {
        const { error } = await supabase.from("vacancies").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("vacancies").insert(payload);
        if (error) throw error;
      }
      setEditing(null);
      reload();
    } catch (err: any) {
      setError(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !session) {
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
    <div className="min-h-screen w-full" style={{ backgroundColor: CREAM }}>
      <header className="border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: BLUE }}>
            Vacancies CMS
          </h1>
          <div className="flex-1" />
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:underline"
          >
            <ExternalLink className="h-4 w-4" /> View site
          </Link>
          <span className="hidden sm:block text-sm text-neutral-500">{session.user.email}</span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white text-sm hover:bg-neutral-50"
            style={{ borderColor: BORDER }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            All vacancies <span className="text-neutral-500">({vacancies.length})</span>
          </h2>
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: BLUE }}
          >
            <Plus className="h-4 w-4" /> New vacancy
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          </div>
        ) : (
          <div
            className="rounded-2xl bg-white border overflow-hidden"
            style={{ borderColor: BORDER }}
          >
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500 border-b" style={{ borderColor: BORDER }}>
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Department</th>
                  <th className="px-4 py-3 hidden md:table-cell">Closes</th>
                  <th className="px-4 py-3 hidden md:table-cell">Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v) => (
                  <tr key={v.id} className="border-b last:border-0" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3 font-medium text-neutral-900">{v.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: v.status === "open" ? "rgba(29,161,242,0.12)" : "#f3f4f6",
                          color: v.status === "open" ? BLUE : "#6b7280",
                        }}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">{v.department}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{formatDate(v.closes_at)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{v.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(v)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-neutral-700 hover:underline"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(v)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:underline ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {vacancies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                      No vacancies yet. Click "New vacancy" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl my-0 sm:my-6">
            <div
              className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white sm:rounded-t-2xl"
              style={{ borderColor: BORDER }}
            >
              <h3 className="text-lg font-semibold">
                {editing.id ? "Edit vacancy" : "New vacancy"}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-neutral-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Title" required>
                  <input
                    required
                    value={editing.title ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        title: e.target.value,
                        slug: editing.slug || slugify(e.target.value),
                      })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Slug (URL)">
                  <input
                    value={editing.slug ?? ""}
                    onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })}
                    className="input"
                    placeholder="senior-therapist"
                  />
                </Field>
              </div>

              <Field label="Short intro (card)">
                <textarea
                  rows={2}
                  value={editing.intro ?? ""}
                  onChange={(e) => setEditing({ ...editing, intro: e.target.value })}
                  className="input"
                />
              </Field>

              <Field label="Long description (detail page)">
                <textarea
                  rows={5}
                  value={editing.long_intro ?? ""}
                  onChange={(e) => setEditing({ ...editing, long_intro: e.target.value })}
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Type">
                  <input
                    value={editing.type ?? ""}
                    onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Experience">
                  <input
                    value={editing.experience ?? ""}
                    onChange={(e) => setEditing({ ...editing, experience: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Reports to">
                  <input
                    value={editing.reports_to ?? ""}
                    onChange={(e) => setEditing({ ...editing, reports_to: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Salary">
                  <input
                    value={editing.salary ?? ""}
                    onChange={(e) => setEditing({ ...editing, salary: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Department">
                  <input
                    value={editing.department ?? ""}
                    onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Location">
                <input
                  value={editing.location ?? ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Posted at">
                  <input
                    type="date"
                    value={editing.posted_at ?? ""}
                    onChange={(e) => setEditing({ ...editing, posted_at: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Closes at">
                  <input
                    type="date"
                    value={editing.closes_at ?? ""}
                    onChange={(e) => setEditing({ ...editing, closes_at: e.target.value || null })}
                    className="input"
                  />
                </Field>
                <Field label="Status">
                  <select
                    value={editing.status ?? "open"}
                    onChange={(e) =>
                      setEditing({ ...editing, status: e.target.value as "open" | "closed" })
                    }
                    className="input"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </Field>
              </div>

              <Field label="Sort order (lower = first)">
                <input
                  type="number"
                  value={editing.sort_order ?? 0}
                  onChange={(e) =>
                    setEditing({ ...editing, sort_order: Number(e.target.value) })
                  }
                  className="input"
                />
              </Field>

              <Field label="Responsibilities (one per line)">
                <textarea
                  rows={5}
                  value={editing.responsibilities_text ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, responsibilities_text: e.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="Benefits / Why us (one per line)">
                <textarea
                  rows={4}
                  value={editing.benefits_text ?? ""}
                  onChange={(e) => setEditing({ ...editing, benefits_text: e.target.value })}
                  className="input"
                />
              </Field>

              <Field label="Cover image">
                <div className="flex items-center gap-3">
                  {editing.cover_image_url && (
                    <img
                      src={editing.cover_image_url}
                      alt=""
                      className="h-16 w-24 rounded object-cover border"
                      style={{ borderColor: BORDER }}
                    />
                  )}
                  <label
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white text-sm cursor-pointer hover:bg-neutral-50"
                    style={{ borderColor: BORDER }}
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading…" : "Upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUpload(f);
                      }}
                    />
                  </label>
                  {editing.cover_image_url && (
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, cover_image_url: null })}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </Field>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div
                className="flex items-center justify-end gap-3 pt-3 border-t sticky bottom-0 bg-white"
                style={{ borderColor: BORDER }}
              >
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-full border bg-white text-sm"
                  style={{ borderColor: BORDER }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: BLUE }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid ${BORDER};border-radius:.5rem;padding:.5rem .75rem;outline:none;background:#fff;font-size:14px}.input:focus{box-shadow:0 0 0 2px rgba(29,161,242,.25)}`}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
