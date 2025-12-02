// --------------------------------------------
// PHASE 3 – ARCHIV SYSTEM
// --------------------------------------------

// Lädt Archiv aus localStorage
function loadArchive() {
    let data = localStorage.getItem("businessArchive");
    if (!data) return [];
    return JSON.parse(data);
}

// Speichert Archiv in localStorage
function saveArchive(data) {
    localStorage.setItem("businessArchive", JSON.stringify(data));
}

// Speichert ein Dokument
function archiveSave(doc) {
    let all = loadArchive();
    all.push(doc);
    saveArchive(all);
    alert("Gespeichert!");
}

// Löscht ein Dokument
function archiveDelete(index) {
    let all = loadArchive();
    all.splice(index, 1);
    saveArchive(all);
    renderArchive();
}

// Zeigt ein gespeichertes Dokument an (für später)
function archiveShow(index) {
    let all = loadArchive();
    alert("Dokument geladen: " + JSON.stringify(all[index], null, 2));
}

// Baut Tabelle im Archiv
function renderArchive() {
    const container = document.getElementById("archiveTable");

    if (!container) return;

    let data = loadArchive();

    container.innerHTML = `
        <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Netto</th>
            <th>MwSt</th>
            <th>Brutto</th>
            <th>Type</th>
            <th>Anzeigen</th>
            <th>Löschen</th>
        </tr>
    `;

    data.forEach((d, i) => {
        container.innerHTML += `
            <tr>
                <td>${d.number}</td>
                <td>${d.date}</td>
                <td>${d.customer}</td>
                <td>${d.netto.toFixed(2)}</td>
                <td>${d.mwst}</td>
                <td>${d.brutto.toFixed(2)}</td>
                <td>${d.type}</td>
                <td><button onclick="archiveShow(${i})">🔍 Show</button></td>
                <td><button onclick="archiveDelete(${i})">🗑 Delete</button></td>
            </tr>
        `;
    });
}
