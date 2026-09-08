const supabaseClient = window.supabaseClient;
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
        console.error("Could not find General forum:", forumError);
        return;
    }

    const { data: existingMember, error: memberError } =
        await supabaseClient
            .from("forum_members")
            .select("id")
            .eq("forum_id", generalForum.id)
            .eq("user_id", user.id)
            .maybeSingle();

    if (memberError) {
        console.error("Could not check forum membership:", memberError);
        return;
    }
    if (!existingMember) {

        const { error: joinError } =
            await supabaseClient
                .from("forum_members")
                .insert({
                    forum_id: generalForum.id,
                    user_id: user.id
                });

        if (joinError) {
            console.error(
                "Could not join General:",
                joinError
            );
            return;
        }

        console.log("User automatically joined General!");

    } else {

        console.log("User is already a member of General.");

    }
}
setupGeneralForum();
async function loadJoinedForums() {

    const { data: userData, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !userData.user) {
        console.log("No user is logged in.");
        return;
    }

    const user = userData.user;

    const { data, error } = await supabaseClient
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

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = "<p>You haven't joined any forums yet.</p>";
        return;
    }

    data.forEach(member => {

        const forum = member.forums;

        const card = document.createElement("div");

        card.className = "forum-card";

        card.innerHTML = `
            <h2>${forum.name}</h2>
            <p>${forum.description || "No description yet."}</p>
            <button class="btn-primary" onclick="openForum('${forum.id}')">
                Open Forum
            </button>
        `;

        container.appendChild(card);
    });
}

loadJoinedForums();
async function openForum(forumId) {

    const { data, error } = await supabaseClient
        .from("forums")
        .select("id, name, description")
        .eq("id", forumId)
        .single();

    if (error) {
        console.error("Could not open forum:", error);
        return;
    }

    const container = document.getElementById("joinedForums");

    container.innerHTML = `
        <div class="forum-card">
            <h1>${data.name}</h1>
            <p>${data.description || "No description yet."}</p>

            <button class="btn-primary" onclick="loadJoinedForums()">
                ← Back to Forums
            </button>
        </div>
    `;
}