import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { token, title } = req.body || {};
  if (!token || !title)
    return res.status(400).json({ success: false, message: "缺少参数" });

  const filename = title.replace(/\s+/g, "-").toLowerCase() + ".md";
  const filepath = path.join(process.cwd(), "source", "_posts", filename);
  const content = `---
title: ${title}
date: ${new Date().toISOString()}
---

这是新建的文章内容。
`;

  fs.writeFileSync(filepath, content);
  return res.status(200).json({ success: true, filename });
}
