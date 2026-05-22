export default async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ ok: false, message: "허용되지 않은 요청입니다." }); }
  try {
    const { code } = req.body || {};
    const expectedCode = process.env.SIGNUP_ACCESS_CODE;
    if (!expectedCode) return res.status(500).json({ ok: false, message: "서버 코드가 설정되지 않았습니다." });
    if (!code || typeof code !== "string") return res.status(400).json({ ok: false, message: "코드를 입력해주세요." });
    if (code.trim() !== expectedCode) return res.status(401).json({ ok: false, message: "코드가 일치하지 않습니다." });
    return res.status(200).json({ ok: true });
  } catch { return res.status(500).json({ ok: false, message: "서버 확인 중 오류가 발생했습니다." }); }
}
