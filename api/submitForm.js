// /api/submitForm.js
// 作用：保存用户提交的留言或反馈信息到 GitHub 仓库
// 例如保存到 data/forms/YYYY-MM-DD-HH-mm.json

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { name, email, message } = req.body;

  const githubToken = process.env.GITHUB_TOKEN;
  const repo = "Sun1105/hexo-source"; // ⚠️ 替换为你的源仓库
  const branch = "main";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = `data/forms/${timestamp}.json`;

  const content = JSON.stringify({ name, email, message, timestamp }, null, 2);

  try {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const result = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `表单提交：${name}`,
        content: Buffer.from(content).toString("base64"),
        branch,
      }),
    });

    const data = await result.json();
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
