const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log(email, password);
  try {
    const response = await fetch("/loginUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    console.log(response);
    if (response.ok) {
      const responsedata = await response.json();
      if (responsedata.data === "admin") {
        window.location.href = `/Dashboard`;
      } else {
        //   // You can handle the response data here, e.g., display a success message to the user
        window.location.href = `/Home`;
      }
    } else {
      throw new Error("Failed to Login");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
});
