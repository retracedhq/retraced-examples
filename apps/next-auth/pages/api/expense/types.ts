export class Expense {
    id?: number;
    title: string;
    amount: number;
    constructor(obj: any) {
        this.id = obj.id;
        this.title = obj["title"];
        this.amount = parseFloat(obj["amount"].toString());
    }
}

export class ExpenseStore {
    private static _instance: ExpenseStore;
    store: Expense[] = [];
    static getInstance(): ExpenseStore {
        if (!this._instance) {
            this._instance = new ExpenseStore()
        }
        return ExpenseStore._instance;
    }
    private constructor() {
        this.store = [];
        // this.push(new Expense({ title: "Gas", amount: "100" }))
        // this.push(new Expense({ title: "Electricity", amount: "1000" }))
        // this.push(new Expense({ title: "Internet", amount: "500" }))
        // this.push(new Expense({ title: "Property Tax", amount: "2000" }))
    }

    public getIndex(): number {
        return this.store.length + 1;
    }

    public push(obj: Expense) {
        obj.id = this.getIndex();
        this.store.push(obj);
        return this.store;
    }

    public pop(obj: Expense) {
        this.store = this.store.filter(e => e.id != obj.id) || [];
        return this.store;
    }

    public update(obj: Expense) {
        this.store = this.store.filter(e => e.id != obj.id);
        this.store.push(obj);
        return this.store;
    }
}