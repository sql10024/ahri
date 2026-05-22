import { supabaseAdmin } from "../lib/supabase.js";

const requiredFields = [
  "user_id",
  "password",
  "nickname",
  "name",
  "bank_name",
  "account_number",
  "exchange_password",
  "phone_number",
  "recent_site"
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      ok: false,
      message: "허용되지 않은 요청입니다."
    });
  }

  try {
    const body = req.body || {};

    for (const field of requiredFields) {
      const value = body[field];

      if (typeof value !== "string" || value.trim() === "") {
        return res.status(400).json({
          ok: false,
          message: "모든 정보를 입력해주세요."
        });
      }
    }

    if (typeof body.password !== "string" || body.password.length < 6) {
      return res.status(400).json({
        ok: false,
        message: "비밀번호는 6글자 이상이어야 합니다."
      });
    }

    let chargeImages = [];

    try {
      const chargeInfo = JSON.parse(body.recent_site);

      chargeImages = Array.isArray(chargeInfo.images)
        ? chargeInfo.images.filter(Boolean)
        : [chargeInfo.image, chargeInfo.image2].filter(Boolean);

      if (!chargeImages.length) {
        return res.status(400).json({
          ok: false,
          message: "최근 충전내역 사진은 최소 1개 이상 업로드해주세요."
        });
      }
    } catch {
      return res.status(400).json({
        ok: false,
        message: "충전내역 정보를 확인해주세요."
      });
    }

    const member = {
      user_id: body.user_id.trim(),
      password: body.password,
      nickname: body.nickname.trim(),
      name: body.name.trim(),

      bank_name: body.bank_name.trim(),
      account_number: body.account_number.trim(),
      exchange_password: body.exchange_password,

      carrier: (body.carrier || "").trim(),
      phone_number: body.phone_number.trim(),
      birth_front: (body.birth_front || "").trim(),
      birth_back_first_digit: (body.birth_back_first_digit || "").trim(),

      recent_site: "",
      recent_amount: (body.recent_amount || "").trim(),
      charge_history: "",

      charge_image_1: chargeImages[0] || "",
      charge_image_2: chargeImages[1] || ""
    };

    const { error } = await supabaseAdmin
      .from("members")
      .insert([member]);

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({
          ok: false,
          message: "이미 존재하는 아이디 또는 닉네임입니다."
        });
      }

      return res.status(500).json({
        ok: false,
        message: "회원가입 저장 중 오류가 발생했습니다."
      });
    }

    return res.status(200).json({ ok: true });

  } catch {
    return res.status(500).json({
      ok: false,
      message: "서버 처리 중 오류가 발생했습니다."
    });
  }
}
