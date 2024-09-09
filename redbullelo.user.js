// ==UserScript==
// @name        Red bull elo + click to sort
// @namespace   Violentmonkey Scripts
// @match       https://www.aom.gg/*
// @grant       none
// @version     1.1
// @author      JAB
// @description 04/09/2024, 15:17:54
// ==/UserScript==

(function() {
    'use strict';

    // Set a timer to check for the table and add the column, this is because the site does not reload when you interact, but if you use a mutator it seems to freeze, could probably be done better
    const checkTableInterval = setInterval(function() {
        const table = document.querySelector('table');
        // console.log("Checking for table:", table); // Debug log

        // Check if the "RBW Elo" column header exists
        let rbwEloHeader = null;
        if (table) {
            const headerCells = table.querySelectorAll('th');
            for (let i = 0; i < headerCells.length; i++) { //This should be replaced with a query instead of a manaul loop
                if (headerCells[i].textContent.trim() === "RBW Elo") {
                    rbwEloHeader = headerCells[i];
                    break;
                }
            }
        }
        // console.log("RBW Elo header found:", rbwEloHeader); // Debug log

        if (table && !rbwEloHeader) {
            // console.log("Table found and column not added, enhancing table"); // Debug log
            enhanceTable(table);
            // clearInterval(checkTableInterval); // Clear the interval once the column is added, This is will result in the average missing if you intereact with the site without reloading
        }
    }, 500);

    function enhanceTable(table) {
        // addMeanColumn(table);
        makeHeadersSortable(table);
        addRowCounter(table); // Comment this out if you dont care about the row counter on the right
    }

    function addMeanColumn(table) {
        // console.log("Adding 'RBW Elo' column"); // Debug log
        // Add the "Mean" header cell
        const headerRow = table.querySelector('thead:nth-child(2) tr');
        const meanHeader = document.createElement('th');
        meanHeader.classList.add('h-12', 'text-2xl', 'px-4', 'text-left', 'align-middle', 'font-medium', 'text-muted-foreground');
        meanHeader.textContent = 'RBW Elo';
        headerRow.appendChild(meanHeader);
        // Iterate through each player row and calculate the mean
        const playerRows = table.querySelectorAll('tbody tr');
        playerRows.forEach(row => {
            const eloCell = row.querySelector('td:nth-child(3)');
            const highestEloCell = row.querySelector('td:nth-child(4) span');

            const elo = parseInt(eloCell.textContent);
            const highestElo = parseInt(highestEloCell.textContent);

            const mean = (elo + highestElo) / 2;

            // Create the "Mean" cell and append it to the row
            const meanCell = document.createElement('td');
            meanCell.classList.add('p-4', 'text-xl', 'align-middle');
            meanCell.textContent = mean;
            // meanCell.style.color = 'red'; // Add this line to make the text red
            row.appendChild(meanCell);
        });
    }

    function makeHeadersSortable(table) {
        const headerRow = table.querySelector('thead:nth-child(2) tr');
        const headerCells = headerRow.querySelectorAll('th');

        headerCells.forEach((headerCell, columnIndex) => {
            headerCell.style.cursor = 'pointer';
            let sortAscending = true; // Start with ascending order

            headerCell.addEventListener('click', () => {
                sortTable(table, columnIndex, sortAscending);
                sortAscending = !sortAscending; // Toggle sort order
            });
        });
    }


    function makeRowsSortable(table) {
        const newRows = table.querySelectorAll('tbody tr:not([data-sortable])'); // Select only new rows
        newRows.forEach((row, rowIndex) => {
            row.setAttribute('data-sortable', 'true'); // Mark row as sortable
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
                cell.addEventListener('click', () => {
                    sortTable(table, cellIndex);
                });
            });
        });
    }

    function sortTable(table, columnIndex, sortAscending) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
            const cellA = rowA.querySelectorAll('td')[columnIndex].textContent;
            const cellB = rowB.querySelectorAll('td')[columnIndex].textContent;

            let comparison = 0;
            if (!isNaN(cellA) && !isNaN(cellB)) {
                comparison = Number(cellA) - Number(cellB);
            } else {
                comparison = cellA.localeCompare(cellB);
            }

            // Reverse the comparison for descending order
            return sortAscending ? comparison : -comparison;
        });

        // Reattach the sorted rows to the table body
        rows.forEach(row => tbody.appendChild(row));
    }

    function addRowCounter(table) {
        const tbody = table.querySelector('tbody');
        updateRowCounter(tbody); // Initial counter setup

        // Observe changes in the table body (e.g., sorting, filtering)
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    updateRowCounter(tbody);
                }
            });
        });

        observer.observe(tbody, { childList: true });
    }

    function updateRowCounter(tbody) {
        const rows = tbody.querySelectorAll('tr');
        let counter = 1;

        rows.forEach(row => {
            let counterCell = row.querySelector('td.row-counter'); // Select by class

            if (!counterCell) { // If counter cell doesn't exist, create it
                counterCell = document.createElement('td');
                counterCell.classList.add('p-4', 'text-xl', 'align-middle', 'row-counter'); // Add the class
                row.appendChild(counterCell);
            }

            counterCell.textContent = counter; // Update the counter value
            counter++;
        });
    }

})();
