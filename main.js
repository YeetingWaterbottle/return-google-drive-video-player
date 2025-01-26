const elements = {
    url_input: document.querySelector("#url-input"),
    input_status_message: document.querySelector("#url-status"),
    // open_new_tab_button: document.querySelector("#open-new-tab"),
    open_below_button: document.querySelector("#open-below"),
    video_embed_container: document.querySelector("#video-embed-container"),
};

const form_info = {
    video_id: "",
    link_ready: false
};

function verify_link(video_url) {
    if (video_url.trim() === "") return "empty";

    try {
        const parsedUrl = new URL(video_url);
        return parsedUrl.hostname === "drive.google.com" ? "valid" : "invalid";
    } catch (error) {
        return "invalid";
    }
}

function update_validation(link_status) {
    switch (link_status) {
        case "valid":
            elements.url_input.setAttribute("aria-invalid", "false");
            elements.input_status_message.textContent = "This link works!";
            form_info.link_ready = true;

            form_info.video_id = get_video_id(elements.url_input.value);
            break;

        case "invalid":
            elements.url_input.setAttribute("aria-invalid", "true");
            elements.input_status_message.textContent = "This is not a google drive link, try again.";
            form_info.link_ready = false;
            break;

        case "empty":
            elements.url_input.setAttribute("aria-invalid", "");
            elements.input_status_message.textContent = "";
            form_info.link_ready = false;
            break;
    }

    set_button_status(form_info.link_ready);
}

function get_video_id(video_url) {
    const parsedUrl = new URL(video_url);

    const fileIdRegex = new RegExp(String.raw`/d/([^/]+)`); // checks between /d/ and optionally ending /

    const match = parsedUrl.pathname.match(fileIdRegex);

    if (match) {
        form_info.video_id = match[1];
        return form_info.video_id;
    } else {
        alert("video id not found");
        return;
    }
}

function get_embed_iframe(video_id) {
    return `<iframe frameborder="0" allowfullscreen="" height=500px width=800px src="https://drive.google.com/file/d/${video_id}/preview"></iframe>`;
}

function set_button_status(link_ready) {
    const action_buttons = document.querySelectorAll(".action-button > button");

    action_buttons.forEach(button => {
        if (link_ready) {
            button.removeAttribute("disabled");
            button.removeAttribute("data-tooltip");
        } else {
            button.setAttribute("disabled", "");
            button.setAttribute("data-tooltip", "Enter a valid drive link");
        }
    });
}

elements.url_input.addEventListener("input", (event) => {
    const url_string = event.target.value;

    const url_valid_status = verify_link(url_string);

    update_validation(url_valid_status);
});

// elements.open_new_tab_button.addEventListener("click", () => {
//     const video_tab = window.open("", "_blank");

//     const video_embed_html = get_embed_iframe(form_info.video_id);
//     video_tab.document.write(video_embed_html);
// });

elements.open_below_button.addEventListener("click", () => {
    elements.video_embed_container.innerHTML = get_embed_iframe(form_info.video_id);
});

update_validation();
