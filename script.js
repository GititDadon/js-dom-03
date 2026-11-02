
const form = document.querySelector("#expense-form");
const descInput = document.querySelector("#desc");
const amountInput = document.querySelector("#amount");
const categorySelect = document.querySelector("#category");
const rowsContainer = document.querySelector("#rows");
const totalElement = document.querySelector("#total");
const filterSelect = document.querySelector("#filter");
const sortButton = document.querySelector("#sort-btn");
const formError = document.querySelector("#form-error");
const noRows = document.querySelector("#no-rows");

let expenses = [];
let nextId = 1;
let isSorted = false;

// Step 1 - Add expense
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const desc = descInput.value.trim();
    const amount = Number(amountInput.value);

    if (desc === "") {
        formError.textContent = "Please add a description";
        formError.hidden = false;
        descInput.focus();
        return;
    }

    if (
        amountInput.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        formError.textContent = "The amount must be larger than 0";
        formError.hidden = false;
        amountInput.focus();
        return;
    }

    formError.textContent = "";
    formError.hidden = true;

    expenses.push({
        id: nextId++,
        desc: desc,
        amount: amount,
        category: categorySelect.value
    });

    descInput.value = "";
    amountInput.value = "";
    descInput.focus();

    render();
});

// Step 2 - Render table
function render() {
    rowsContainer.replaceChildren();

    let filteredExpenses = filterCatagory();

    // Step 6 - Sort high to low
    if (isSorted) {
        filteredExpenses = filteredExpenses.toSorted((a, b) => {
            return b.amount - a.amount;
        });
    }

    filteredExpenses.forEach((expense) => {
        const tr = document.createElement("tr");

        // Step 7 - Big expenses
        if (expense.amount > 100) {
            tr.classList.add("big");
        }

        const tdDesc = document.createElement("td");
        tdDesc.textContent = expense.desc;

        const tdCategory = document.createElement("td");
        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = expense.category;
        tdCategory.appendChild(badge);

        const tdAmount = document.createElement("td");
        tdAmount.textContent = expense.amount.toFixed(2);

        const tdDelete = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete");
        deleteButton.dataset.id = expense.id;

        tdDelete.appendChild(deleteButton);

        tr.append(tdDesc, tdCategory, tdAmount, tdDelete);
        rowsContainer.appendChild(tr);
    });

    // Show or hide empty message
    noRows.hidden = filteredExpenses.length > 0;

    // Step 4 - Total of visible expenses
    expensesTotal(filteredExpenses);
}

// Step 3 - Delete expense
rowsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".delete");

    if (!button || !rowsContainer.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);

    expenses = expenses.filter((expense) => {
        return expense.id !== id;
    });

    render();
});

// Step 4 - Calculate total
function expensesTotal(filteredExpenses) {
    const sum = filteredExpenses.reduce((sum, expense) => {
        return sum + expense.amount;
    }, 0);

    totalElement.textContent = sum.toFixed(2);
}

// Step 5 - Filter by category
function filterCatagory() {
    if (filterSelect.value === "all") {
        return expenses;
    }

    return expenses.filter((expense) => {
        return expense.category === filterSelect.value;
    });
}

filterSelect.addEventListener("change", () => {
    render();
});

// Step 6 - Toggle sorting
sortButton.addEventListener("click", () => {
    isSorted = !isSorted;

    sortButton.textContent = isSorted
        ? "Sort by amount: on"
        : "Sort by amount: off";

    render();
});

// Initial render
render();
