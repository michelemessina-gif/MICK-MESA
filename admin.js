const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
  window.location.href = "login.html";
}

const logoutBtn = document.querySelector("#logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  });
}
const messagesList = document.querySelector("#messages-list");
const subscribersList = document.querySelector("#subscribers-list");
const messagesCount = document.querySelector("#messages-count");
const subscribersCount = document.querySelector("#subscribers-count");


/* =========================
   LOAD CONTACT MESSAGES
========================= */

async function loadMessages() {
  try {
    const response = await fetch("http://127.0.0.1:5050/api/messages");
    const result = await response.json();
    messagesCount.textContent = result.messages.length;

    if (!result.success) {
      messagesList.textContent = "Could not load messages.";
      return;
    }

    if (result.messages.length === 0) {
      messagesList.textContent = "No messages yet.";
      return;
    }

    messagesList.innerHTML = result.messages
      .map((message) => {
        return `
          <article class="admin-message" data-id="${message.id}">
            <input class="edit-name" value="${message.name}">
            <input class="edit-email" value="${message.email}">
            <textarea class="edit-message">${message.message}</textarea>

            <small>${message.created_at}</small>

            <button class="save-message-btn" data-id="${message.id}">
              Save
            </button>

            <button class="delete-message-btn" data-id="${message.id}">
              Delete
            </button>
          </article>
        `;
      })
      .join("");

    attachSaveButtons();
    attachDeleteButtons();
  } catch (error) {
    messagesList.textContent = "Something went wrong.";
    console.error(error);
  }
}

/* =========================
   UPDATE CONTACT MESSAGE
========================= */

function attachSaveButtons() {
  const saveButtons = document.querySelectorAll(".save-message-btn");

  saveButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const card = button.closest(".admin-message");
      const id = button.dataset.id;

      const data = {
        name: card.querySelector(".edit-name").value,
        email: card.querySelector(".edit-email").value,
        message: card.querySelector(".edit-message").value
      };

      const response = await fetch(`http://127.0.0.1:5050/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        loadMessages();
      }
    });
  });
}

/* =========================
   DELETE CONTACT MESSAGE
========================= */

function attachDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-message-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;

      const response = await fetch(`http://127.0.0.1:5050/api/messages/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (result.success) {
        loadMessages();
      }
    });
  });
}

/* =========================
   LOAD NEWSLETTER SUBSCRIBERS
========================= */

async function loadSubscribers() {
  try {
    const response = await fetch("http://127.0.0.1:5050/api/subscribers");
    const result = await response.json();
    subscribersCount.textContent = result.subscribers.length;

    if (!result.success) {
      subscribersList.textContent = "Could not load subscribers.";
      return;
    }

    if (result.subscribers.length === 0) {
      subscribersList.textContent = "No subscribers yet.";
      return;
    }

    subscribersList.innerHTML = result.subscribers
      .map((subscriber) => {
        return `
          <article class="admin-message" data-id="${subscriber.id}">
            <h3>${subscriber.email}</h3>
            <small>${subscriber.created_at}</small>

            <button class="delete-subscriber-btn" data-id="${subscriber.id}">
              Delete
            </button>
          </article>
        `;
      })
      .join("");

    attachSubscriberDeleteButtons();
  } catch (error) {
    subscribersList.textContent = "Something went wrong.";
    console.error(error);
  }
}

/* =========================
   DELETE NEWSLETTER SUBSCRIBER
========================= */

function attachSubscriberDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-subscriber-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;

      const response = await fetch(`http://127.0.0.1:5050/api/subscribers/${id}`, {
        method: "DELETE"
      });

      const result = await response.json();

      if (result.success) {
        loadSubscribers();
      }
    });
  });
}

/* =========================
   INITIAL LOAD
========================= */

loadMessages();
loadSubscribers();