const fileInput = document.getElementById("csvFile");
const summary = document.getElementById("summary");

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) return;

    summary.innerHTML = `
        <p><strong>Selected File</strong></p>
        <p>${file.name}</p>
    `;

});