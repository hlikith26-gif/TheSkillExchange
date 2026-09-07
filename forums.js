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