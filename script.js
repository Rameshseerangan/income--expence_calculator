// Select DOM elements
const typeInput = document.getElementById('type'); 
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');
const netBalance = document.getElementById('net-balance');
const entriesList = document.getElementById('entries-list');
const addBtn = document.getElementById('add-btn');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

// Variables to store income and expense entries
let entries = JSON.parse(localStorage.getItem('entries')) || [];

// Function to calculate totals
function calculateTotals() {
    let income = 0, expense = 0;
    entries.forEach(entry => {
        if (entry.amount >= 0) {
            income += entry.amount;
        } else {
            expense += Math.abs(entry.amount); // Accumulate expenses
        }
    });
    totalIncome.textContent = `$${income.toFixed(2)}`;
    totalExpense.textContent = `$${expense.toFixed(2)}`;
    netBalance.textContent = `$${(income - expense).toFixed(2)}`;
}

// Function to render entries based on the filter.....
function renderEntries(filter = 'all') {
    entriesList.innerHTML = '';
    let filteredEntries = entries;

    if (filter === 'income') {
        filteredEntries = entries.filter(entry => entry.amount >= 0);
    } else if (filter === 'expense') {
        filteredEntries = entries.filter(entry => entry.amount < 0);
    }

    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.classList.add('mb-2');
        li.innerHTML = `
            ${entry.description}: $${entry.amount.toFixed(2)}
            <button class="text-red-500 ml-4" onclick="deleteEntry(${index})">Delete</button>
            <button class="text-green-500 ml-2" onclick="editEntry(${index})">Edit</button>
        `;
        entriesList.appendChild(li);
    });

    calculateTotals();
}

//  add or update an entry
function addOrUpdateEntry() {
    const description = descriptionInput.value.trim();
    let amount = parseFloat(amountInput.value);
    const type = typeInput.value;  // New: get selected type

    if (description === '' || isNaN(amount)) {
        alert('Please enter a valid description and amount.');
        return;
    }

    // Adjust the amount based on the selected type
    if (type === 'expense') {
        amount = -Math.abs(amount);  
    } else {
        amount = Math.abs(amount);   
    }

    const entry = { description, amount };

    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));

    renderEntries();
    descriptionInput.value = '';
    amountInput.value = '';
}

// Function to delete an entry
function deleteEntry(index) {
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

// Function to edit an entry
function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = Math.abs(entry.amount); // Set positive value in input
    typeInput.value = entry.amount >= 0 ? 'income' : 'expense'; // Set type selector

    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

// Add event listener for the Add button
addBtn.addEventListener('click', addOrUpdateEntry);

// Add event listener for filter change
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        renderEntries(event.target.value);
    });
});

// Initial rendering of entries
renderEntries();
