const form = document.getElementById("registrationForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission
  // Validate form input
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("inputPassword6").value;

  if (!name || !email || !password) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    // Send form data using fetch API
    const response = await fetch("/userRegister", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }
    // Log the response body
    const responseBody = await response.json(); // Parse response as JSON
    const userEmail = responseBody.email; // Extract user's email from the response
    console.log(userEmail);
    // Redirect to email verification page with user's email as query parameter
    window.location.href = `/emailverification?email=${encodeURIComponent(
      userEmail
    )}`;
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed. Please try again later.");
  }
});
