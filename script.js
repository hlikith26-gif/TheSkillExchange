// ---- Supabase setup ----
// Requires this in your HTML <head> or before this script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Sign Up ----
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!email) {
            alert("Please enter an email!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { name: name } // stored in user_metadata
            }
        });

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        console.log("Created user:", data.user);
        alert("Account created! Check your email to confirm your address.");

        window.location.href = "login.html";
    });
}

// ---- Sign In ----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("Email2").value.trim();
        const password = document.getElementById("password2").value;

        if (!email || !password) {
            alert("Please enter your email and password!");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        console.log("Logged in user:", data.user);
        window.location.href = "main.html";
    });
}

// ---- Log Out ----
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        window.location.href = "login.html";
    });
}
