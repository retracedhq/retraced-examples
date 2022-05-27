import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { saveEvent } from "../components/helpers"
import { Expense } from "./api/expense/types"
import { getAccessRights } from "../components/helpers"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const rights = getAccessRights(session)
  const loading = status === "loading"
  const [title, setTitle] = useState("")
  const [id, setId] = useState(0)
  const [amount, setAmount] = useState(0)
  const [list, setList] = useState([])

  const fetchData = async (first?: boolean) => {
    if (session?.user) {
      if (first && list.length == 0) {
        saveEvent(
          "Log in",
          "r",
          "dev",
          "Log in",
          rights === "viewer"
            ? `(viewer - ${session.user.name?.split(" ")[0].toString()})`
            : rights,
          "Home Page",
          "127.0.0.1",
          "Log in",
          "Home"
        )
      }
      const res = await fetch("/api/expense/get")
      const json = await res.json()
      if (json) {
        setList(json)
      }
    }
  }

  const updateExpense = async (e: any) => {
    const res = await fetch("/api/expense/update", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        id,
        title,
        amount,
      }),
    })
    let old = list.filter((d: any) => d.id == id)[0]
    const json = await res.json()
    if (session?.user?.name) {
      saveEvent(
        "Update Expense Record",
        "u",
        "dev",
        "Update Data",
        session?.user?.name.split(" ")[0],
        "Expense List",
        "127.0.0.1",
        "",
        "Index",
        {
          updates: {
            title:
              title != old["title"] ? `${old["title"]} => ${title}` : undefined,
            amount:
              amount != old["amount"]
                ? `${old["amount"]} => ${amount}`
                : undefined,
          },
        }
      )
    }
    setList(json)
    reset()
  }
  const reset = () => {
    setId(0)
    setAmount(0)
    setTitle("")
  }

  const deleteExpense = async (expense: Expense) => {
    const res = await fetch("/api/expense/delete", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(expense),
    })
    const json = await res.json()
    setList(json)
    if (session?.user?.name) {
      saveEvent(
        "Delete Expense Record",
        "d",
        "dev",
        "Delete Data",
        session?.user?.name.split(" ")[0],
        "Expense List",
        "127.0.0.1",
        "",
        "Index",
        expense
      )
    }
  }

  const saveExpense = async (e: any) => {
    const res = await fetch("/api/expense/save", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        title,
        amount,
      }),
    })
    const json = await res.json()
    setList(json)
    if (session?.user?.name) {
      saveEvent(
        "Create Expense Record",
        "c",
        "dev",
        "Create Data",
        session?.user?.name.split(" ")[0],
        "Expense List",
        "127.0.0.1",
        "",
        "Index"
      )
    }
    reset()
  }

  // Fetch content from protected route
  useEffect(() => {
    fetchData(true)
    setInterval(() => {
      fetchData()
    }, 2500)
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
        <>
          <h1>Add an Expense</h1>
          <form>
            <label>Enter the Amount:</label>
            <br />
            <input
              value={amount}
              type="number"
              id="amount"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <br />
            <label>Description:</label>
            <br />
            <input
              value={title}
              type="text"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <br />
            <input
              type="button"
              id="add"
              value={id == 0 ? "Add" : "Update"}
              onClick={id == 0 ? saveExpense : updateExpense}
            />
            {id != 0 && <button onClick={reset}>Cancel</button>}
          </form>
          <hr />
        </>
      )}
      {list.map((l: Expense) => {
        if (l) {
          return (
            <div key={l.id}>
              {(rights === "admin" || rights === "manager") && (
                <>
                  <button
                    onClick={(e) => {
                      setId(l.id ? l.id : 0)
                      setAmount(l.amount)
                      setTitle(l.title)
                    }}
                  >
                    Edit
                  </button>{" "}
                  <button onClick={(e) => deleteExpense(l)}>Delete</button>
                </>
              )}
              You spent {l.amount}/- for {l.title}
            </div>
          )
        } else {
          return <></>
        }
      })}
    </Layout>
  )
}
