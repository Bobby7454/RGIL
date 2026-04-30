const API_BASE = "http://localhost:5000/api";

export function saveToken(token) {
  localStorage.setItem("rgil_token", token);
}

export function getToken() {
  return localStorage.getItem("rgil_token");
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  return res.json();
}