import { puzlink } from "/dist/index.js";

const NUM_RESULTS = 10;
const CLIPBOARD = (localStorage.getItem("paste") === "true");

function parse() {
    const text = document.getElementById("text").value;
    const results = puzlink.link(text).slice(0, NUM_RESULTS);
    for (let i = 0; i < NUM_RESULTS; i++) {
        const li = document.getElementById(`item-${i}`);
        li.innerHTML = `<p>${results[i].name}<br/><em>${results[i].description}</em></p>`;
    }
}

const text = document.getElementById("text");
text.addEventListener("input", parse);
if (CLIPBOARD) {
    navigator.clipboard.readText().then((paste) => {
        text.value = paste;
        parse();
    })
}
text.focus();

const paste = document.getElementById("paste");
paste.checked = CLIPBOARD;
paste.addEventListener("change", () => {
    localStorage.setItem("paste", paste.checked ? "true" : "false");
});

const results = document.getElementById("results");
for(let i = 0; i < NUM_RESULTS; i++) {
    const li = document.createElement("li");
    li.setAttribute("id", `item-${i}`);
    results.appendChild(li);
}