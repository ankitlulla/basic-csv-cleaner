const fileInput = document.getElementById("csvFile");
const cleanBtn = document.getElementById("cleanBtn");
const downloadBtn = document.getElementById("downloadBtn");
const tableContainer = document.getElementById("tableContainer");

let originalData = [];
let cleanedData = [];
let fileName = "cleaned_data.csv";

// Upload CSV
fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) return;

    fileName = file.name.replace(".csv", "_cleaned.csv");

    Papa.parse(file, {

        header: true,
        skipEmptyLines: true,

        complete: ({ data }) => {

            originalData = data;
            cleanedData = [...data];

            updateStats(originalData, cleanedData);

            displayTable(cleanedData);

            downloadBtn.style.display = "inline-block";

        }

    });

});

// Clean Button
cleanBtn.addEventListener("click", () => {

    cleanedData = [...originalData];

    if (document.getElementById("duplicates").checked)
        cleanedData = removeDuplicates(cleanedData);

    if (document.getElementById("emptyRows").checked)
        cleanedData = removeEmptyRows(cleanedData);

    if (document.getElementById("trim").checked)
        cleanedData = trimWhitespace(cleanedData);

    if (document.getElementById("emptyColumns").checked)
        cleanedData = removeEmptyColumns(cleanedData);

    updateStats(originalData, cleanedData);

    displayTable(cleanedData);

});

// Preview Table
function displayTable(data){

    if(!data.length){

        tableContainer.innerHTML="<p>No data available.</p>";

        return;

    }

    let html="<table><tr>";

    Object.keys(data[0]).forEach(col=>{

        html+=`<th>${col}</th>`;

    });

    html+="</tr>";

    data.forEach(row=>{

        html+="<tr>";

        Object.values(row).forEach(value=>{

            html+=`<td>${value ?? ""}</td>`;

        });

        html+="</tr>";

    });

    html+="</table>";

    tableContainer.innerHTML=html;

}
// Remove duplicate rows
function removeDuplicates(data) {

    const seen = new Set();

    return data.filter(row => {

        const key = JSON.stringify(row);

        if (seen.has(key)) return false;

        seen.add(key);

        return true;

    });

}

// Remove empty rows
function removeEmptyRows(data) {

    return data.filter(row =>

        Object.values(row).some(value =>

            String(value ?? "").trim() !== ""

        )

    );

}

// Trim whitespace
function trimWhitespace(data) {

    return data.map(row => {

        const cleaned = {};

        Object.keys(row).forEach(key => {

            cleaned[key] = String(row[key] ?? "").trim();

        });

        return cleaned;

    });

}

// Remove empty columns
function removeEmptyColumns(data) {

    if (!data.length) return data;

    const columns = Object.keys(data[0]);

    const keep = columns.filter(col =>

        data.some(row => String(row[col] ?? "").trim() !== "")

    );

    return data.map(row => {

        const cleaned = {};

        keep.forEach(col => cleaned[col] = row[col]);

        return cleaned;

    });

}

// Update statistics
function updateStats(original, cleaned) {

    document.getElementById("rowCount").textContent = cleaned.length;

    document.getElementById("columnCount").textContent =
        cleaned.length ? Object.keys(cleaned[0]).length : 0;

    document.getElementById("duplicateCount").textContent =
        original.length - removeDuplicates(original).length;

    document.getElementById("emptyRowCount").textContent =
        original.length - removeEmptyRows(original).length;

}

// Download CSV
downloadBtn.addEventListener("click", () => {

    if (!cleanedData.length) return;

    const csv = Papa.unparse(cleanedData);

    const blob = new Blob([csv], {

        type: "text/csv;charset=utf-8;"

    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = fileName;

    link.click();

});