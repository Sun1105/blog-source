// /api/login.js
// 简单的用户名密码登录，返回 session token
// 可用于后续调用受保护的接口

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    // 登录成功，返回一个简单 token（可用 JWT 代替）
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    return res.status(200).json({ success: true, token });
  }

  res.status(401).json({ success: false, message: "用户名或密码错误" });
}
