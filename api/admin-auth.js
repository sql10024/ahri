export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." }); }
  try {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PAGE_PASSWORD;
    if (!adminPassword) return res.status(500).json({ ok: false, message: "관리자 비밀번호가 설정되지 않았습니다." });
    if (!password || typeof password !== "string") return res.status(400).json({ ok: false, message: "비밀번호를 입력해주세요." });
    if (password !== adminPassword) return res.status(401).json({ ok: false, message: "비밀번호가 올바르지 않습니다." });
    return res.status(200).json({ ok: true });
  } catch { return res.status(500).json({ ok: false, message: "서버 처리 중 오류가 발생했습니다." }); }
}
