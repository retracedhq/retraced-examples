export class Order {
  id?: number
  price: number
  quantity: number
  constructor(obj: any) {
    this.id = obj.id
    this.price = parseFloat(obj["amount"].toString())
    this.quantity = parseFloat(obj["amount"].toString())
  }
}
export class ExpenseStore {
  private static _instance: ExpenseStore
  store: Order[] = []
  static getInstance(): ExpenseStore {
    if (!this._instance) {
      this._instance = new ExpenseStore()
    }
    return ExpenseStore._instance
  }
  private constructor() {
    this.store = []
    this.push(new Order({ title: "Gas", amount: "100" }))
    this.push(new Order({ title: "Electricity", amount: "1000" }))
    this.push(new Order({ title: "Internet", amount: "500" }))
    this.push(new Order({ title: "Property Tax", amount: "2000" }))
  }

  public getIndex(): number {
    return this.store.length + 1
  }

  public push(obj: Order) {
    obj.id = this.getIndex()
    this.store.push(obj)
    return this.store
  }

  public pop(obj: Order) {
    this.store = this.store.filter((e) => e.id != obj.id) || []
    return this.store
  }

  public update(obj: Order) {
    this.store = this.store.filter((e) => e.id != obj.id)
    this.store.push(obj)
    return this.store
  }
}
