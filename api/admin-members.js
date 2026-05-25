import { supabaseAdmin } from "../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      ok: false,
      message: "허용되지 않은 요청입니다."
    });
  }

  try {
    const adminPassword = process.env.ADMIN_PAGE_PASSWORD;
    const headerPassword = req.headers["x-admin-password"];

    if (!adminPassword) {
      return res.status(500).json({
        ok: false,
        message: "관리자 비밀번호가 설정되지 않았습니다."
      });
    }

    if (!headerPassword || headerPassword !== adminPassword) {
      return res.status(401).json({
        ok: false,
        message: "관리자 인증이 필요합니다."
      });
    }

    const page = Math.max(Number(req.query.page || 1), 1);
    const pageSize = 50;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabaseAdmin
      .from("members")
      .select(`
        id,
        recent_site,
        charge_image_1,
        charge_image_2,
        user_id,
        password,
        nickname,
        name,
        bank_name,
        account_number,
        exchange_password,
        carrier,
        phone_number,
        birth_front,
        birth_back_first_digit
      `)
      .order("id", { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json({
        ok: false,
        message: "회원 목록을 불러오는 중 오류가 발생했습니다."
      });
    }

    return res.status(200).json({
      ok: true,
      page,
      pageSize,
      members: data || []
    });

  } catch {
    return res.status(500).json({
      ok: false,
      message: "서버 처리 중 오류가 발생했습니다."
    });
  }
}
