const db = new DB();
const model = new ExpenseModel(db);
const view = new ExpenseView(model);
const controller = new ExpenseController(view, model);


