import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { saveEvent } from "../components/helpers"
import { Order } from "./api/order/types"
import { getAccessRights } from "../components/helpers"
import styles from "../components/layout.module.css"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const rights = getAccessRights(session?.user)
  const loading = status === "loading"
  const [price, setPrice] = useState<number>()
  const [quantity, setAmount] = useState<number>(0)
  const [orders, setOrders] = useState<{
    bids: Order[]
    asks: Order[]
  }>({ bids: [], asks: [] })

  const generateOrders = (
    numOrders: number,
    basePrice: number,
    quantityRange: number,
    priceRangePercentage: number
  ): {
    bids: Order[]
    asks: Order[]
  } => {
    let bids = [],
      asks = []

    for (let i = 0; i < numOrders; i++) {
      const quantity = Math.floor(Math.random() * quantityRange) + 1
      const priceVariation = (basePrice * priceRangePercentage) / 100
      const price = basePrice + (Math.random() * 2 - 1) * priceVariation

      bids.push({
        quantity: quantity,
        price: parseFloat(price.toFixed(2)), // Rounding price to 2 decimal places
      })
    }

    bids = bids.sort((a, b) => b.price - a.price) // Sort bids in descending order

    for (let i = 0; i < numOrders; i++) {
      const quantity = Math.floor(Math.random() * quantityRange) + 1
      const priceVariation = (bids[0].price * priceRangePercentage) / 100
      const price = bids[0].price + (Math.random() * 2 - 1) * priceVariation

      asks.push({
        quantity: quantity,
        price: parseFloat(price.toFixed(2)), // Rounding price to 2 decimal places
      })
    }

    asks = asks.sort((a, b) => a.price - b.price) // Sort asks in ascending order

    return { bids, asks }
  }

  const reset = () => {
    setAmount(0)
    setPrice(0)
  }

  const saveOrder = async (e: any) => {
    if (session?.user?.name) {
      await saveEvent(
        "Order.Create",
        "c",
        rights,
        session?.user?.name.split(" ")[0],
        "Create Order",
        "127.0.0.1",
        "Order created",
        "Orderbook",
        {
          price: price?.toString(),
          quantity: quantity?.toString(),
        }
      )
    }
    reset()
  }

  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  const orderMatched = async () => {
    if (session?.user?.name) {
      await saveEvent(
        "Order.Match",
        "c",
        "Matching Engine",
        "Matching Engine",
        "Orderbook",
        "127.0.0.1",
        "Order matched",
        "Orderbook",
        {
          order: `${uuidv4()} <=> ${uuidv4()}`,
        }
      )
    }
  }

  const saveError = async (e: any) => {
    if (session?.user?.name) {
      const oId = uuidv4()
      await saveEvent(
        "Order.Create",
        "c",
        rights,
        session?.user?.name.split(" ")[0],
        `Order ${oId}`,
        "127.0.0.1",
        "Order creation failed (Unable to reach matching engine)",
        "Orderbook",
        {
          price: price?.toString(),
          quantity: quantity?.toString(),
          orderId: oId,
          error: "Unable to reach matching engine",
          stacktrace: `Error: Unable to reach matching engine
          at Orderbook.createOrder (/Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:39:11)
          at /Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:20:16
          at Array.forEach (<anonymous>)
          at Orderbook.matchOrders (/Users/roberto/Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:19:15)
          at /Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:13:16
          at Array.forEach (<anonymous>)
          at Orderbook.createOrder (/Users/roberto/Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:12:15)
          at /Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:6:16
          at Array.forEach (<anonymous>)
          at Orderbook.matchOrders (/Users/roberto/Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:5:15)
          at /Projects/retraced-examples/apps/next-auth/pages/api/trade/orderbook.ts:13:16`,
          errorcode: "500",
        },
        true
      )
    }
    reset()
  }

  // Fetch content from protected route
  useEffect(() => {
    const orders = generateOrders(10, 500, 100, 0.1)
    setOrders(orders)
    setInterval(() => {
      const orders = generateOrders(10, 500, 100, 0.1)
      setOrders(orders)
    }, 3000)
    setInterval(() => {
      orderMatched()
    }, 7000)
  }, [session])

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      {(rights === "admin" || rights === "manager") && (
        <div>
          <h1>Place an Order</h1>
          <form>
            <label style={{ fontSize: "1.2rem" }}>Quantity:</label>
            <br />
            <input
              className="textPrimary"
              value={quantity}
              type="number"
              id="quantity"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <br />
            <label style={{ fontSize: "1.2rem" }}>Price:</label>
            <br />
            <input
              className="textPrimary"
              value={price}
              type="number"
              id="price"
              onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
            <br />
            <br />
            <input
              className="buttonPrimary"
              type="button"
              id="add"
              value={"Simulate Order"}
              onClick={saveOrder}
            />
            <br />
            <br />
            <input
              className="buttonPrimary"
              type="button"
              id="add"
              value={"Simulate Error"}
              onClick={saveError}
            />
          </form>
          <hr />
        </div>
      )}
      <div className={styles.row}>
        <div className={styles.column}>
          {orders.bids && orders.bids.length > 0 && (
            <div>
              <h2>Bids</h2>
              <table>
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Orders</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.bids.slice(0, 10).map((order, n) => (
                    <tr key={`bids-${n}`} style={{ color: "blue" }}>
                      <td>{order.quantity}</td>
                      <td>{Math.round(Math.random() * 100) + 1}</td>
                      <td>{order.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className={styles.column}>
          {orders.asks && orders.asks.length > 0 && (
            <div>
              <h2>Offers</h2>
              <table>
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Orders</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.asks.slice(0, 10).map((order, n) => (
                    <tr key={`asks-${n}`} style={{ color: "red" }}>
                      <td>{order.quantity}</td>
                      <td>{Math.round(Math.random() * 100) + 1}</td>
                      <td>{order.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
