const fileInput = document.getElementById("csvFile");
const summary = document.getElementById("summary");
const tableContainer = document.getElementById("tableContainer");
const cleanBtn = document.getElementById("cleanBtn");

let csvData = [];

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) return;

    summary.innerHTML = `<p><strong>Selected File:</strong> ${file.name}</p>`;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,

        complete: function (results) {
            csvData = results.data;
            displayTable(csvData);
        }

    });

});

cleanBtn.addEventListener("click", () => {

    let cleanedData = [...csvData];

    if (document.getElementById("duplicates").checked) {
        cleanedData = removeDuplicates(cleanedData);
    }

    displayTable(cleanedData);

});

function removeDuplicates(data) {

    const uniqueRows = [];
    const seen = new Set();

    data.forEach(row => {

        const key = JSON.stringify(row);

        if (!seen.has(key)) {
            seen.add(key);
            uniqueRows.push(row);
        }

    });

    return uniqueRows;

}

function displayTable(data) {

    if (data.length === 0) {
        tableContainer.innerHTML = "<p>No data found.</p>";
        return;
    }

    let table = "<table>";

    table += "<tr>";

    Object.keys(data[0]).forEach(column => {
        table += `<th>${column}</th>`;
    });

    table += "</tr>";

    data.forEach(row => {

        table += "<tr>";

        Object.values(row).forEach(value => {
            table += `<td>${value}</td>`;
        });

        table += "</tr>";

    });

    table += "</table>";

    tableContainer.innerHTML = table;

}