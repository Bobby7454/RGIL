import { getNotices } from "./api.js";

async function loadNotices() {
  const data = await getNotices();

  const noticeList = document.getElementById("notice-list");
  const eventList = document.getElementById("event-list");

  if (!noticeList || !eventList) return;

  noticeList.innerHTML = "";
  eventList.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("div");
    row.className = "notice-item";

    row.innerHTML = `
      <div class="notice-date">${item.date}</div>
      <div class="notice-text">${item.text}</div>
    `;

    if (item.panel === "notices") {
      noticeList.appendChild(row);
    } else {
      eventList.appendChild(row);
    }
  });
}

loadNotices();