// /api/login.js
// 简单的用户名密码登录，返回 session token
// 可用于后续调用受保护的接口

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // ✅ 解析请求体（vercel 不自动解析）
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { username, password } = body || {};

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "缺少用户名或密码" });
    }

    // ✅ 检查账号密码（从环境变量中读取）
    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {
      // 登录成功，返回 token
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
      return res.status(200).json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: "用户名或密码错误" });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
