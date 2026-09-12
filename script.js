

const SUPABASE_URL = "https://crutagettwacxapnglus.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydXRhZ2V0dHdhY3hhcG5nbHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MzM3MTIsImV4cCI6MjEwNDEwOTcxMn0.-Hz-T-JPzfl1T2CLuQ4_6u16QXdbd9GGpHFGAKqEbh0";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;

let username = "";

async function getUsername() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        console.log("No user logged in");
        return;
    }

    username = data.user.user_metadata.name;

    console.log(username);
}

getUsername();


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

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { name: name } 
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

        const { data, error } = await supabaseClient.auth.signInWithPassword({
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


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async function () {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        window.location.href = "login.html";
    });
}
// above code is AI Generated
// below code is NOT AI Generated

async function AddEvent() {
    const eventName = document.getElementById("evname").value
    const desc = document.getElementById("evDesc").value
    const ldate = document.getElementById("Ldate").value
    const edate = document.getElementById("Edate").value
    

    if (!eventName || !desc || !ldate || !edate) {
        alert("All Fields Are Required!")
        return;
    }
    if (desc.length > 300) {
        alert("Description is too long. Max Character limit - 300")
        return;
    }
    const {data, error} = await supabaseClient
        .from("events")
        .insert({
            name: eventName,
            description: desc,
            ldtr: ldate,
            doe: edate
        })
    
    if (error) {
        alert(error.message)
        return;
    } else {
        alert("Published")
    }
    events_close()
    GetEvents();
}
async function GetEvents() {
    const {data, error} = await supabaseClient
        .from("events")
        .select("*")
        
    if (error) {
        alert(error.message)
        return;
    }
    
    document.getElementById("evCon").innerHTML = ""
    data.forEach(events => {
        document.getElementById("evCon").innerHTML +=
        `<div class="cardset">
            <h1>${events.name}</h1>
            <p>${events.description}</p>
            <p class="dblue">Last Date To Register: <span>${events.ldtr}</span></p>
            <p class="dpurple">Date of Event: <span>${events.doe}</span></p>
        </div>`
        ;
});
}
GetEvents()

supabaseClient
    .channel("events-realtime")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "events"
        },
        () => {
            GetEvents();
        }
    )
    .subscribe();


async function SaveLR() {
    const LRname = document.getElementById("nameLR").value
    const lr = document.getElementById("lrfiles").files[0]
    const subject = document.getElementById("subjectLR").value
    const desc = document.getElementById("descLR").value

    
    if (!LRname || !lr || !subject || !desc) {
        alert("All fields are required!")
        return;
    }
    if (desc.length > 350) {
        alert("Description is too long. Max Character limit - 350")
        return;
    }
    const safeName = lr.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filepath = `${crypto.randomUUID()}-${safeName}`;
    const {error: upError} = await supabaseClient
        .storage
        .from("LeRs")
        .upload(filepath, lr)
    if (upError.message == 'new row violates row-level security policy for table "events"') {
        alert("You need to login")
        window.location.href = "login.html";
        return;
    
    } else if (upError) {
        alert(upError.message)
        return;
    } else {
        alert("Published")
    }

    const {data: urldata} = await supabaseClient
        .storage
        .from("LeRs")
        .getPublicUrl(filepath);

    const {error: xderror} = await supabaseClient
        .from("learning_resources")
        .insert({
            name: LRname,
            file_url: urldata.publicUrl,
            subject: subject,
            desc: desc
        })
    if (xderror) {
        alert(xderror.message)
        return;
    } else {
        alert("Published")
        close_publish()
        ShowLR()
    }

}

// Below code is AI

let allLR = []

async function ShowLR() {

    const {data, error} = await supabaseClient
        .from("learning_resources")
        .select("*")
    if (error) {
        alert(error.message)
    }


    allLR = data

    RenderLR(allLR)
}
ShowLR()


function RenderLR(list) {
    document.getElementById("lrdiv").innerHTML = ""

    list.forEach(lr => {
        document.getElementById("lrdiv").innerHTML +=
            `<div class="cardset">
                <h1>${lr.name}</h1>
                <p>${lr.desc}</h1><br>
                <a href="${lr.file_url}" target="_blank"><button class="btn-primary">Download</button></a>
            </div>`
           
    })
}

function FilterLR() {
    const query = document.getElementById("lrsearch").value.toLowerCase();
    const filtered = allLR.filter(lr => lr.name.toLowerCase().includes(query));
    RenderLR(filtered);
}

// Below code is NOT AI

async function getName() {
    const {data, error} = await supabaseClient.auth.getUsers();
    if (error) {
        alert(error.message)
    }
    const user = data.user
    document.getElementById("nameDis").innerHTML = user.user_metadata.name
}
getName()