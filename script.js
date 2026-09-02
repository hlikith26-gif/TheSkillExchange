const client = new Appwrite.Client();

client
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6a96e8210021e963d2ac");

const account = new Appwrite.Account(client);



document.getElementById("signupForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;


    
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }


    try {

        
        const user = await account.create({
            userId: Appwrite.ID.unique(),
            email: email,
            password: password,
            name: name
        });

        console.log("User created:", user);

        alert("Account created successfully! 🎉");

        
        window.location.href = "main.html";

    } catch (error) {

        console.error(error);
        alert("Error: " + error.message);

    }

});