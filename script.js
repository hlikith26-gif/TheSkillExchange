const client = new Appwrite.Account(client);
client
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('6a96e8210021e963d2ac')
const account = new Appwrite.Account(client);
async function signup() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('password').value;
    try {
        const user = await account.create({
            userID: Appwrite.ID.Unique(),
            email: email,
            password: password,
            name: name
        })
        alert('Account created');
    } catch (error) {
        alert(error.message);
    }
}