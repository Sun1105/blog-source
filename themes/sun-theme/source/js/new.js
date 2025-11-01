// ===========================================
// 📄 new.js - 新建文章逻辑
// ===========================================
// 功能：
// 1️⃣ 检查用户是否已登录（localStorage中是否存在token）
// 2️⃣ 读取输入的文章标题
// 3️⃣ 调用 /api/newpost 接口创建新的Markdown文件
// 4️⃣ 提示用户结果，并可选择跳转到编辑页面
// ===========================================

// 检查是否登录（简单token判断）
const token = localStorage.getItem("token");
if (!token) {
  alert("请先登录后再新建文章。");
  window.location.href = "/login/";
}

// 获取HTML中的输入与按钮
const btn = document.getElementById("create-btn");
const titleInput = document.getElementById("title");
const msg = document.getElementById("msg");

// 点击“创建文章”按钮时触发
btn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  if (!title) {
    msg.textContent = "⚠️ 请输入文章标题。";
    return;
  }

  msg.textContent = "正在创建中...";

  try {
    const res = await fetch("/api/newpost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, title })
    });
    const data = await res.json();

    if (data.success) {
      msg.textContent = `✅ 文章已创建：${data.filename}`;
      setTimeout(() => {
        // 跳转到编辑页继续编辑
        window.location.href = "/edit/";
      }, 1000);
    } else {
      msg.textContent = "❌ 创建失败：" + data.message;
    }
  } catch (err) {
    console.error(err);
    msg.textContent = "🚨 创建出错：" + err.message;
  }
});
