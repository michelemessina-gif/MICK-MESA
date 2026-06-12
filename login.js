const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector(".login-message");

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    const data = {
      email: formData.get("email"),
      password: formData.get("password")
    };
    console.log(data);

    try {
      const response = await fetch("http://127.0.0.1:5050/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      loginMessage.textContent = result.message;

      if (result.success) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "admin.html";
      }
    } catch (error) {
      loginMessage.textContent = "Something went wrong. Please try again.";
      console.error(error);
    }
  });
}