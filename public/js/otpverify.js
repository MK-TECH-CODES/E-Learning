const form = document.getElementById("verifydata");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const otpInput = document.getElementById("otp").value; // Corrected ID to "opt"
  console.log(otpInput);
  // Get the email value from the page
  const email = document.querySelector(".card-header div").innerText;

  try {
    const response = await fetch("/verifyOTP", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: otpInput, email: email }),
    });

    if (response.ok) {
      const data = await response.json();
      // You can handle the response data here, e.g., display a success message to the user
      window.location.href = `/Home`;
    } else {
      throw new Error("Failed to verify OTP");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
});
