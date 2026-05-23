import { supabaseAdmin } from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." });
  }

  try {
    const adminPassword = process.env.ADMIN_PAGE_PASSWORD;
    const headerPassword = req.headers["x-admin-password"];

    if (!adminPassword) {
      return res.status(500).json({ ok: false, message: "관리자 비밀번호가 설정되지 않았습니다." });
    }

    if (!headerPassword || headerPassword !== adminPassword) {
      return res.status(401).json({ ok: false, message: "관리자 인증이 필요합니다." });
    }

    const { id } = req.body || {};

    if (!id) {
      return res.status(400).json({ ok: false, message: "삭제할 회원 정보가 없습니다." });
    }

    const { error } = await supabaseAdmin
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ ok: false, message: "회원 삭제 중 오류가 발생했습니다." });
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, message: "서버 처리 중 오류가 발생했습니다." });
  }
}
