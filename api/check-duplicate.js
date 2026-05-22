import { supabaseAdmin } from "../lib/supabase.js";
const allowedTypes = { user_id: "user_id", nickname: "nickname" };
export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." }); }
  try {
    const { type, value } = req.body || {};
    if (!allowedTypes[type]) return res.status(400).json({ ok: false, message: "잘못된 확인 요청입니다." });
    if (!value || typeof value !== "string" || value.trim() === "") return res.status(400).json({ ok: false, message: "값을 입력해주세요." });
    const column = allowedTypes[type];
    const { data, error } = await supabaseAdmin.from("members").select(column).eq(column, value.trim()).limit(1);
    if (error) return res.status(500).json({ ok: false, message: "중복확인 중 오류가 발생했습니다." });
    if (Array.isArray(data) && data.length > 0) return res.status(409).json({ ok: false, message: type === "user_id" ? "이미 사용 중인 아이디입니다." : "이미 사용 중인 닉네임입니다." });
    return res.status(200).json({ ok: true });
  } catch { return res.status(500).json({ ok: false, message: "서버 처리 중 오류가 발생했습니다." }); }
}
