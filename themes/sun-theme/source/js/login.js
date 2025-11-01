document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const msg = document.getElementById("msg");
  msg.textContent = "正在登录...";

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.token);
    msg.textContent = "登录成功，跳转中...";
    setTimeout(() => (window.location.href = "/edit/"), 800);
  } else {
    msg.textContent = data.message;
  }
});
