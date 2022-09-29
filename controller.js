class ExpenseController{
    constructor(view, model){
        this.DOM = view.getDOM();
        this.model = model;
        this.view = view;

        this.addExpense = this.addExpense.bind(this);
        this.editExpense=this.editExpense.bind(this);
        this.removeExpense = this.removeExpense.bind(this);
        this.setExpenseEditable = this.setExpenseEditable.bind(this)
        this.unsetExpenseEditable = this.unsetExpenseEditable.bind(this);
        this.hideErrorMessage = this.hideErrorMessage.bind(this);

        this.displayMonthlySummary();
        this.model.subscribe(this);
    }

    setUpEventHandlers(){
        this.DOM.expenseForm.addEventListener('submit', this.addExpense);
        this.DOM.expenseForm.addEventListener('reset', this.hideErrorMessage);

        [...this.DOM.deleteButtons].forEach((deleteButton) => {
            deleteButton.addEventListener('click', this.removeExpense);
        });

        [...this.DOM.editButtons].forEach((editButton) => {
            editButton.addEventListener('click', this.setExpenseEditable);
        });

        [...this.DOM.editForms].forEach((editForm) => {
            editForm.addEventListener('reset', this.unsetExpenseEditable);
        });

        [...this.DOM.editForms].forEach((editForm) => {
            editForm.addEventListener('submit', this.editExpense);
        });
    }

    addExpense(e){
        e.preventDefault();

        const form = e.currentTarget;

        const { 
            type: {value: type},
            description: {value: description},
            date: {value: date}, 
            amount: {value: amount}
        } = form;
        try{
            this.model.addExpense({
                type,
                amount,
                date,
                description
            })
            this.view.hideErrorMessage();
            this.view.clearForm();
            this.displayErrorMessage("no-error");


        } catch (error){
            this.displayErrorMessage(error);
        }
    }

    editExpense(e){
        e.preventDefault();

        const form = e.currentTarget;
        const id = form.attributes['data-id'].value;

        const { 
            description: {value: description},
            date: {value: date}, 
            amount: {value: amount}
        } = form;
        try{
            this.model.editExpense({
                amount,
                date,
                description,
                id
            });

            this.view.hideErrorMessage();
            this.view.unsetExpenseEditable(id);
            this.setUpEventHandlers();

        } catch(error){
            this.view.displayErrorMessage(error);
        }
    }

    removeExpense(e){
        if(confirm("Are you sure you want to delete this expense?")){
        const button = e.currentTarget;
        const expenseId = button.attributes['data-id'].value;
        this.model.removeExpense(expenseId)
        }  
    }

    setExpenseEditable(e){
        const button = e.currentTarget;
        const expenseId = button.attributes['data-id'].value;

        this.view.setExpenseEditable(expenseId);
        this.setUpEventHandlers();
    }

    unsetExpenseEditable(e){
        const form = e.currentTarget;
        const expenseId = form.attributes['data-id'].value;

        this.view.hideErrorMessage();
        this.view.unsetExpenseEditable(expenseId);
        this.setUpEventHandlers();
    }

    hideErrorMessage(){
        this.view.hideErrorMessage();
    }

    notify(){
        this.setUpEventHandlers();
        this.displayMonthlySummary();
    }

    displayErrorMessage(error){
        if(error =="no-error"){
            this.view.displaySuccessMessage();
        }else if(error instanceof InvalidAmountError){
            this.view.displayAmountErrorMessage();
        }else if(error instanceof InvalidDateError){
            this.view.displayDateErrorMessage();
        }else{
            this.view.displayDescriptionErrorMessage();
        }
    }

    displayMonthlySummary(){
        const summary = this.model.produceMonthData();
        this.view.displayMonthlySummary(summary);
    }
}