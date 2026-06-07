const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector(".form-message");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message")
    };

    try {
      const response = await fetch("http://127.0.0.1:5050/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      formMessage.textContent = result.message;

      if (result.success) {
        contactForm.reset();
      }
    } catch (error) {
      formMessage.textContent = "Something went wrong. Please try again.";
      console.error(error);
    }
  });
}