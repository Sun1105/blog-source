import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { token, filename, content } = req.body || {};
  if (!token || !filename || !content)
    return res.status(400).json({ success: false, message: "缺少参数" });

  // 简单的 token 验证
  if (!token.startsWith("token_"))
    return res.status(403).json({ success: false, message: "未登录" });

  const filePath = path.join(process.cwd(), "source", "_posts", filename);
  fs.writeFileSync(filePath, content);
  return res.status(200).json({ success: true, message: "保存成功" });
}
