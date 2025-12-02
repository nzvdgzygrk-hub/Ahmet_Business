// ------------------------
// BUSINESS SUITE MOTOR v3.2 – PHASE 1
// Tabellen-Engine, Summen, MwSt, Live-Berechnung
// ------------------------

// Rechnet alle Tabellen neu (für Invoice, Offer, Delivery, Packing List Price Table)
function recalcTable(tableId, totalId = null) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll("tbody tr");

    let totalSum = 0;

    rows.forEach((row, index) => {
        // Nummer aktualisieren
        row.querySelector(".item").textContent = index + 1;

        const qty = parseFloat(row.querySelector(".qty").value) || 0;
        const price = parseFloat(row.querySelector(".unitPrice").value) || 0;

        const total = qty * price;
        row.querySelector(".rowTotal").textContent = total.toFixed(2);

        totalSum += total;
    });

    if (totalId) {
        document.getElementById(totalId).textContent = totalSum.toFixed(2);
    }

    return totalSum;
}

// Fügt eine Zeile hinzu
function addRow(tableId, totalId = null) {
    const table = document.getElementById(tableId).querySelector("tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="item"></td>
        <td><input class="desc" type="text" placeholder="Description"></td>
        <td><input class="qty" type="number" step="0.01" value="0"></td>
        <td><input class="unit" type="text" placeholder="Unit"></td>
        <td><input class="unitPrice" type="number" step="0.01" value="0"></td>
        <td class="rowTotal">0.00</td>
        <td><button onclick="removeRow(this, '${tableId}', '${totalId}')">Löschen</button></td>
    `;
    table.appendChild(row);

    addListeners();
    recalcTable(tableId, totalId);
}

// Entfernt eine Zeile
function removeRow(btn, tableId, totalId = null) {
    btn.parentElement.parentElement.remove();
    addListeners();
    recalcTable(tableId, totalId);
}

// Live-Listener
function addListeners() {
    document.querySelectorAll(".qty, .unitPrice").forEach(input => {
        input.addEventListener("input", () => {
            const table = input.closest("table").id;
            const totalId = input.closest("table").dataset.total || null;
            recalcTable(table, totalId);
        });
    });
}

// MWST & Summen für Rechnungen / Angebote
function calcInvoiceTotals() {
    const netto = parseFloat(document.getElementById("invoiceTotal").textContent) || 0;
    const mwstRate = parseFloat(document.getElementById("mwstSelect").value);

    const mwstAmount = netto * (mwstRate / 100);
    const brutto = netto + mwstAmount;

    document.getElementById("invoiceMwstAmount").textContent = mwstAmount.toFixed(2);
    document.getElementById("invoiceBrutto").textContent = brutto.toFixed(2);
}

// Listener für MwSt
function initMwSt() {
    const el = document.getElementById("mwstSelect");
    if (!el) return;

    el.addEventListener("change", calcInvoiceTotals);
}

// Initial Setup
document.addEventListener("DOMContentLoaded", () => {
    addListeners();
    initMwSt();
});
