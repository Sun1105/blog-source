// /api/savePost.js
// 该文件导出一个异步的 API 路由处理函数，用于把传入的文件内容保存到 GitHub 仓库中（通过 GitHub Contents API）
// 适用于部署在像 Vercel 这样的无服务器平台（Serverless Function）中
export default async function handler(req, res) {
  // 为了允许来自任意来源的跨域请求，这里设置了 CORS 响应头
  // 注意：实际生产环境中请尽量限制 Access-Control-Allow-Origin 到可信域名以提高安全性
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 允许的请求方法：POST 与预检请求的 OPTIONS
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  // 允许的请求头，这里允许 Content-Type（通常用于 JSON 请求体）
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理预检请求（浏览器在跨域发送非简单请求前会先发送 OPTIONS）
  // 如果是 OPTIONS 请求，直接返回 200 代表允许该跨域请求（无需继续处理）
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 从请求体中解构所需字段
  // filePath: 要写入的仓库文件路径（相对于仓库根目录）
  // content: 文件的原始文本内容（将会在发送给 GitHub API 时被 base64 编码）
  // message: Commit 的提交信息（可选）
  const { filePath, content, message } = req.body;

  // GitHub Token 应放在环境变量中，示例使用 process.env.GITHUB_TOKEN
  // 切勿把 token 硬编码在源码中或在前端暴露
  const githubToken = process.env.GITHUB_TOKEN; // 放在 Vercel 环境变量中

  // 仓库信息：示例使用 your/repo 格式，请根据实际情况修改为你的仓库
  // repo 格式为 "owner/repo"
  const repo = "sun1105/hexo-source"; // 你的源代码仓库
  // 分支名（例如 main 或 master），将提交到这个分支
  const branch = "main"; // 或 master

  try {
    // GitHub Contents API 的目标 URL，filePath 必须是相对仓库根目录的路径
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    // 先做一次 GET 请求以获取目标文件的元信息（包括 sha）
    // 如果文件已存在，后续 PUT 请求需要使用该 sha 来进行更新
    const getRes = await fetch(apiUrl, {
      headers: { Authorization: `token ${githubToken}` },
    });
    // 将响应解析为 JSON（如果文件不存在，GitHub 会返回 404 并带有错误信息）
    const fileData = await getRes.json();

    // 发送 PUT 请求到 GitHub API 来创建或更新文件
    // PUT 请求体包含:
    // - message: 提交信息
    // - content: 文件内容的 Base64 编码
    // - sha: 如果是更新已存在的文件，需要提供旧文件的 sha；如果是新文件，可不传
    // - branch: 指定要写入的分支
    const result = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message || `更新 ${filePath}`,
        // Node.js 环境可以直接使用 Buffer 将字符串转为 base64
        content: Buffer.from(content).toString("base64"),
        // 当文件存在时，GitHub GET 返回中会带有 sha；如果是新文件，fileData.sha 可能为 undefined
        // GitHub API 在创建新文件时不需要 sha 字段
        sha: fileData.sha, // 如果是新文件，可以不传
        branch,
      }),
    });

    // 解析 PUT 请求的响应
    const data = await result.json();
    // 返回成功响应给前端
    res.status(200).json({ success: true, data });
  } catch (error) {
    // 捕获异常并返回 500
    // 注意：这里直接返回 error.message，生产环境中请避免泄露敏感信息
    res.status(500).json({ error: error.message });
  }
}