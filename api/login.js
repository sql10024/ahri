import { supabaseAdmin } from "../lib/supabase.js";
export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." }); }
  try {
    const { user_id, password } = req.body || {};
    if (!user_id || !password || typeof user_id !== "string" || typeof password !== "string") return res.status(400).json({ ok: false, message: "아이디와 비밀번호를 입력해주세요." });
    const { data, error } = await supabaseAdmin.from("members").select("user_id,password").eq("user_id", user_id.trim()).eq("password", password).limit(1);
    if (error) return res.status(500).json({ ok: false, message: "로그인 확인 중 오류가 발생했습니다." });
    if (!Array.isArray(data) || data.length === 0) return res.status(401).json({ ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    return res.status(200).json({ ok: true });
  } catch { return res.status(500).json({ ok: false, message: "서버 처리 중 오류가 발생했습니다." }); }
}
