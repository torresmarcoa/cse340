// Show password button
document.addEventListener("DOMContentLoaded", () => {
    const showpasswordbtn = document.getElementById("showpassword");
    if (showpasswordbtn) {
        showpasswordbtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent form submission when clicking the button
            const passwordInput = document.getElementById("account_password");
            const type = passwordInput.getAttribute("type");
            if (type === "password") {
                passwordInput.setAttribute("type", "text");
                showpasswordbtn.innerHTML = "Hide Password";
            } else {
                passwordInput.setAttribute("type", "password");
                showpasswordbtn.innerHTML = "Show Password";
            }
        });
    }
});