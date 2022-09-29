class DB {
    all(){
        const expenses = [];

        for (let key in localStorage) {
            const expense = JSON.parse(localStorage.getItem(key));
            if(expense !=null){
                expenses.push(expense);
            } 
        }

        return expenses;
    }
    add(expense){
        localStorage.setItem(expense.id, JSON.stringify(expense));
    }
    remove(expenseId){
        localStorage.removeItem(expenseId);
    }
    edit(expense){
        this.add(expense);
    }
}