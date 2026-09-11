const apiKey = import.meta.env.VITE_NASA_API_KEY;
const screen = document.getElementById("screen");
const cmdInput = document.getElementById("cmd");

const registry = {
    help: () => "CMDS: apod, time, clear, search <query>",
    time: () => new Date().toUTCString(),
    clear: () => { screen.innerHTML = ""; return null; },
    apod: async () => {
        print("PULLING NASA TELEMETRY...", "log-dim");
        try {
            const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
            const data = await res.json();
            const card = document.createElement("div");
            card.className = "kage-card";
            card.innerHTML = `
                <h3>// ${data.title}</h3>
                ${data.media_type === 'image' ? `<img src="${data.url}" alt="${data.title}">` : ''}
                <p>${data.explanation}</p>
            `;
            screen.appendChild(card);
            screen.scrollTop = screen.scrollHeight;
            return null;
        } catch {
            return "ERROR: FAILED TO FETCH APOD DATA";
        }
    }
};

function print(text, className = "") {
    if (!text) return;
    const p = document.createElement("p");
    if (className) p.className = className;
    p.innerText = text;
    screen.appendChild(p);
    screen.scrollTop = screen.scrollHeight;
}

function updateClock() {
    const now = new Date();
    document.getElementById("clock").innerText = now.toTimeString().split(" ")[0];
}

cmdInput.addEventListener("keydown", async e => {
    if (e.key === "Enter") {
        const val = cmdInput.value.trim();
        if (!val) return;
        print(`> ${val}`);
        cmdInput.value = "";

        const [action, ...args] = val.split(" ");
        const query = args.join(" ");

        if (registry[action]) {
            const res = await registry[action](query);
            print(res);
        } else if (action === "search") {
            if (!query) print("ERROR: QUERY REQUIRED", "log-err");
            else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else {
            print(`ERROR: COMMAND '${action}' NOT FOUND`, "log-err");
        }
    }
});

setInterval(updateClock, 1000);
updateClock();
document.addEventListener("click", () => cmdInput.focus());