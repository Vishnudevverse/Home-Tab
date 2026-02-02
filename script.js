async function loadgamemodule() {
    const frame = document.createElement("iframe");
    frame.src = "t-rex-runner/index.html";
    document.querySelector("main").appendChild(frame);
}
loadgamemodule();
// function toggleTheme() {
//     document.body.classList.toggle("dark");

//     // Update link text depending on mode
//     // const link = document.querySelector("footer section a");
//     // link.textContent = document.body.classList.contains("dark") ? "Dark" : "Light";
// }

// function togglebattery
