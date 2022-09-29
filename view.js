class ExpenseView {
    constructor(model){
        this.DOM = this.selectDOMElements();
        this.model = model;
        this.editableExpenses = new Set();

        this.model.subscribe(this);
    }

    selectDOMElements(){
        return {
            monthlySummary: document.getElementById('monthly-summary'),
            errorMessage: document.getElementById('error'),
            editButtons: document.getElementsByClassName('edit'),
            deleteButtons: document.getElementsByClassName('delete'),
            editForms: document.getElementsByClassName('edit-expense-form'),
            expenseForm: document.getElementById('new-expense-form'),
            expenses: document.getElementById('expenses'),
        }
    }

    getDOM(){
        return Object.assign({}, this.DOM);
    }

    notify(){
        this.DOM.expenses.innerHTML = "";

        if(this.model.expenses != []){
            this.model.all().forEach(expense =>{
                this.DOM.expenses.innerHTML += (this.editableExpenses.has(expense.id) 
                                                ? this.makeExpenseEditRow(expense) 
                                                : this.makeExpenseDisplayRow(expense));
            })
        }
    }

    setExpenseEditable(expenseId){
        this.editableExpenses.add(expenseId);
        this.notify();
    }

    unsetExpenseEditable(expenseId){
        this.editableExpenses.delete(expenseId);
        this.notify();
    }

    makeExpenseEditRow({ amount, date, description, id }){
        return `
            <div class="expense">
                <form class="edit-expense-form" data-id="${id}">
                    <input class="edit-input"type="text" name="description" value="${description}">
                    <input class="edit-input"type="text" name="date" value="${date}">
                    <input class="edit-input"type="text" name="amount" value="${amount}">

                    <button class="lg"type="reset">Cancel</button>
                    <button class="lg"type="submit">Save</button>
                </form>
            </div>
        `
    }

    makeExpenseDisplayRow(expense){
        const type = expense.type;
        const description = expense.description;
        const date = expense.date;
        const symbol = type == "expense" ? "-" : "+";
        const amount = symbol + " $" + expense.amount;
        const color = type == "expense" ? "red" : "green";

        return `
        <div class="expense">
                <h3 class="${color}">${description}</h3>
            <div class="field">
                <p>${date}</p>
                <p class="${color}-text">${amount}</p>
            </div>
            <div class='actions'>
                <button class='edit sm' data-id="${expense.id}"><i class="fa-solid fa-pencil"></i></button>
                <button class='delete sm' data-id="${expense.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        `;
    }
    displayAmountErrorMessage(){
        this.DOM.errorMessage.innerText = "Invalid amount"
        this.DOM.errorMessage.className= "";
    }

    displayDateErrorMessage(){
        this.DOM.errorMessage.innerText = "Invalid date"
        this.DOM.errorMessage.className= "";
    }
    displayDescriptionErrorMessage(){
        this.DOM.errorMessage.innerText = "Invalid description"
        this.DOM.errorMessage.className= "";
    }
    displaySuccessMessage(){
        this.DOM.errorMessage.innerText = "Expense has been added"
        this.DOM.errorMessage.className= "success";
    }

    hideErrorMessage(){
        this.DOM.errorMessage.innerText = ""
        this.DOM.errorMessage.className= "hidden";
    }

    displayMonthlySummary(summary){
        const color = summary.totalAmount >=0 ? "green-text" : "red-text";
        this.DOM.monthlySummary.innerHTML = `
        <h3 class="${color}">Net Cashflow: $${summary.totalAmount.toFixed(2)}</h3>
        `;
    }

    clearForm(){
        this.DOM.expenseForm.reset();
    }
}