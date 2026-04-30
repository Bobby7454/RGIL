import { login, addNotice, deleteNotice } from "./api.js";

async function adminLogin() {
  const username = prompt("Username:");
  const password = prompt("Password:");

  const res = await login(username, password);

  if (res.token) {
    localStorage.setItem("token", res.token);
    alert("Login success");
  } else {
    alert("Login failed");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "A") {
    adminLogin();
  }
});