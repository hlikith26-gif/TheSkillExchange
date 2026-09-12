

async function setupGeneralForum() {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        console.log("No user is currently logged in.");
        return;
    }

    const user = userData.user;

    const { data: generalForum, error: forumError } =
        await supabaseClient
            .from("forums")
            .select("id")
            .eq("name", "General")
            .single();

    if (forumError) {
        console.error("Could not find General:", forumError);
        return;
    }

    const { data: existingMember } =
        await supabaseClient
            .from("forum_members")
            .select("id")
            .eq("forum_id", generalForum.id)
            .eq("user_id", user.id)
            .maybeSingle();

    if (!existingMember) {

        const { error } =
            await supabaseClient
                .from("forum_members")
                .insert({
                    forum_id: generalForum.id,
                    user_id: user.id
                });

        if (error) {
            console.error("Could not join General:", error);
        }
    }
}

function escapeHtml(text) {

    const div = document.createElement("div");
    div.textContent = text;

    return div.innerHTML;
}

async function loadJoinedForums(searchTerm = "") {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        console.log("No user logged in.");
        return;
    }

    const user = userData.user;

    const { data, error } =
        await supabaseClient
            .from("forum_members")
            .select(`
                forum_id,
                forums (
                    id,
                    name,
                    description
                )
            `)
            .eq("user_id", user.id);

    if (error) {
        console.error("Could not load joined forums:", error);
        return;
    }

    const container = document.getElementById("joinedForums");

    if (!container) return;

    container.innerHTML = "";

    const filtered = data.filter(member =>
        member.forums &&
        member.forums.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = "<p>No joined forums found.</p>";
    }

    filtered.forEach(member => {

        const forum = member.forums;

        const card = document.createElement("div");

        card.className = "forum-card";

        card.innerHTML = `
            <h2>${escapeHtml(forum.name)}</h2>

            <p>
                ${escapeHtml(
                    forum.description || "No description yet."
                )}
            </p>

            <button
                class="btn-primary"
                onclick="openForum('${forum.id}')"
            >
                Open Forum
            </button>
        `;

        container.appendChild(card);
    });

    await loadDiscoverForums(searchTerm);
}

async function loadDiscoverForums(searchTerm = "") {

    const { data: userData } =
        await supabaseClient.auth.getUser();

    if (!userData.user) return;

    const user = userData.user;

    const { data: memberships } =
        await supabaseClient
            .from("forum_members")
            .select("forum_id")
            .eq("user_id", user.id);

    const joinedIds =
        memberships.map(member => member.forum_id);

    const { data: forums, error } =
        await supabaseClient
            .from("forums")
            .select("id, name, description, creator_id")
            .order("created_at", { ascending: true });

    if (error) {
        console.error("Could not load discover forums:", error);
        return;
    }

    const container =
        document.getElementById("discoverForums");

    if (!container) return;

    container.innerHTML = "";

    const availableForums = forums.filter(forum => {

        const notJoined =
            !joinedIds.includes(forum.id);

        const matchesSearch =
            forum.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return notJoined && matchesSearch;
    });

    if (availableForums.length === 0) {

        container.innerHTML =
            "<p>No forums available to join.</p>";

        return;
    }

    availableForums.forEach(forum => {

        const card = document.createElement("div");

        card.className = "forum-card";

        card.innerHTML = `
            <h2>${escapeHtml(forum.name)}</h2>

            <p>
                ${escapeHtml(
                    forum.description || "No description yet."
                )}
            </p>

            <button
                class="btn-primary"
                onclick="joinForum('${forum.id}')"
            >
                Join Forum
            </button>
        `;

        container.appendChild(card);
    });
}

async function joinForum(forumId) {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please log in first.");
        return;
    }

    const { error } =
        await supabaseClient
            .from("forum_members")
            .insert({
                forum_id: forumId,
                user_id: userData.user.id
            });

    if (error) {

        if (error.code === "23505") {
            alert("You are already in this forum.");
        } else {
            console.error("Could not join forum:", error);
            alert("Could not join forum.");
        }

        return;
    }

    await loadJoinedForums();
}

function showCreateForumDialog() {

    let dialog = document.getElementById("createForumDialog");

    if (!dialog) {

        dialog = document.createElement("dialog");

        dialog.id = "createForumDialog";

        dialog.innerHTML = `
            <form method="dialog" id="createForumForm">

                <h2>Create a Forum</h2>

                <input
                    id="newForumName"
                    type="text"
                    placeholder="Forum name"
                    required
                >

                <br><br>

                <textarea
                    id="newForumDescription"
                    placeholder="Forum description"
                    rows="4"
                ></textarea>

                <br><br>

                <button
                    type="button"
                    class="btn-primary"
                    onclick="createForum()"
                >
                    Create
                </button>

                <button
                    type="button"
                    class="btn-outline"
                    onclick="document.getElementById('createForumDialog').close()"
                >
                    Cancel
                </button>

            </form>
        `;

        document.body.appendChild(dialog);
    }

    dialog.showModal();
}


async function createForum() {

    const name =
        document.getElementById("newForumName")
            .value.trim();

    const description =
        document.getElementById("newForumDescription")
            .value.trim();

    if (!name) {
        alert("Please enter a forum name.");
        return;
    }

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please log in first.");
        return;
    }

    const user = userData.user;

    const { data: forum, error } =
        await supabaseClient
            .from("forums")
            .insert({
                name: name,
                description: description,
                creator_id: user.id
            })
            .select()
            .single();

    if (error) {

        if (error.code === "23505") {
            alert("A forum with that name already exists.");
        } else {
            console.error("Could not create forum:", error);
            alert("Could not create forum.");
        }

        return;
    }

    const { error: joinError } =
        await supabaseClient
            .from("forum_members")
            .insert({
                forum_id: forum.id,
                user_id: user.id
            });

    if (joinError) {
        console.error(
            "Forum created but joining failed:",
            joinError
        );
    }

    document
        .getElementById("createForumDialog")
        .close();

    document.getElementById("newForumName").value = "";
    document.getElementById("newForumDescription").value = "";

    await loadJoinedForums();
}

async function openForum(forumId) {

    const { data: forum, error } =
        await supabaseClient
            .from("forums")
            .select("id, name, description")
            .eq("id", forumId)
            .single();

    if (error) {
        console.error("Could not open forum:", error);
        return;
    }

    const container =
        document.getElementById("joinedForums");

    const discover =
        document.getElementById("discoverForums");

    if (discover) {
        discover.style.display = "none";
    }

    container.innerHTML = `

        <div class="forum-card">

            <button style="color: white;"
                class="btn-outline"
                onclick="backToForums()"
            >
                ← Back to Forums
            </button>

            <h1>${escapeHtml(forum.name)}</h1>

            <p>
                ${escapeHtml(
                    forum.description || ""
                )}
            </p>

            <hr>

            <div id="forumMessages">
                <p>Loading messages...</p>
            </div>

            <div class="message-box">

                <input
                    type="text"
                    id="messageInput"
                    placeholder="Write a message..."
                    onkeydown="if(event.key === 'Enter') sendMessage('${forum.id}')"
                >

                <button
                    class="btn-primary"
                    onclick="sendMessage('${forum.id}')"
                >
                    Send
                </button>

            </div>

        </div>
    `;

    await loadMessages(forumId);

    subscribeToMessages(forumId);
}

function backToForums() {

    const discover =
        document.getElementById("discoverForums");

    if (discover) {
        discover.style.display = "grid";
    }

    loadJoinedForums();
}

async function loadMessages(forumId) {

    const { data, error } =
        await supabaseClient
            .from("forum_messages")
            .select("message, created_at")
            .eq("forum_id", forumId)
            .order("created_at", { ascending: true });

    if (error) {
        console.error("Could not load messages:", error);
        return;
    }

    const container =
        document.getElementById("forumMessages");

    if (!container) return;

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML =
            "<p>No messages yet. Be the first to say something!</p>";

        return;
    }

    data.forEach(msg => {

        const messageElement =
            document.createElement("div");

        messageElement.className =
            "forum-message";

        const date =
            new Date(msg.created_at)
                .toLocaleString();

        messageElement.innerHTML = `
            <p>${escapeHtml(msg.message)}</p>
            <small>${date}</small>
        `;

        container.appendChild(messageElement);
    });
}

async function sendMessage(forumId) {

    const input =
        document.getElementById("messageInput");

    if (!input) return;

    const message =
        input.value.trim();

    if (!message) return;

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        alert("Please log in first.");
        return;
    }

    const { error } =
        await supabaseClient
            .from("forum_messages")
            .insert({
                forum_id: forumId,
                user_id: userData.user.id,
                message: message
            });

    if (error) {
        console.error("Could not send message:", error);
        alert("Could not send message.");
        return;
    }

    input.value = "";

    await loadMessages(forumId);
}

function subscribeToMessages(forumId) {

    supabaseClient
        .channel("forum-" + forumId)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "forum_messages",
                filter: "forum_id=eq." + forumId
            },
            () => {
                loadMessages(forumId);
            }
        )
        .subscribe();
}

function setupForumSearch() {

    const search =
        document.getElementById("forumSearch");

    if (!search) return;

    search.addEventListener("input", () => {

        const term =
            search.value.trim();

        loadJoinedForums(term);
    });
}

async function startForumSystem() {

    await setupGeneralForum();

    await loadJoinedForums();

    setupForumSearch();

    const createButton =
        document.getElementById("createForumButton");

    if (createButton) {

        createButton.onclick =
            showCreateForumDialog;
    }
}

startForumSystem();