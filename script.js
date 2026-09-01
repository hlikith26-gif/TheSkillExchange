const emailInput = document.getElementById("Email");
const passwordInput = document.getElementById("password");
const client = new Appwrite.Client();

document.getElementById("signup").addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        console.log("enter email or password")
        return;
    }
    try {
        
    }
}