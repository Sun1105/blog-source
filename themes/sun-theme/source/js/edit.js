const token = localStorage.getItem("token");
if (!token) {
  alert("请先登录");
  location.href = "/login/";
}

document.getElementById("save-btn").addEventListener("click", async () => {
  const content = document.getElementById("content").value;
  const filename = document.getElementById("filename").value;
  const msg = document.getElementById("msg");

  msg.textContent = "正在保存...";
  const res = await fetch("/api/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, filename, content })
  });
  const data = await res.json();
  msg.textContent = data.message;
});
