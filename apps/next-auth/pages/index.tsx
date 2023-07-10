import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { saveEvent } from "../components/helpers"
import { Expense } from "./api/expense/types"
import { getAccessRights } from "../components/helpers"
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
        await saveEvent(
          "Log in",
          "r",
          rights,
          "Log in",
          rights === "viewer"
            ? `(viewer - ${session.user.name?.split(" ")[0].toString()})`
            : rights,
          "Home Page",
          "127.0.0.1",
          "Log in",
          "Home",
          undefined,
          "BOX-2"
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
      await saveEvent(
        "Update Expense Record",
        "u",
        rights,
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
      await saveEvent(
        "Delete Expense Record",
        "d",
        rights,
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
      await saveEvent(
        "Create Expense Record",
        "c",
        rights,
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
        <div>
          <h1>Add an Expense</h1>
          <form>
            <label style={{ fontSize: "1.2rem" }}>Enter the Amount:</label>
            <br />
            <input
              className="textPrimary"
              value={amount}
              type="number"
              id="amount"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
            <br />
            <label style={{ fontSize: "1.2rem" }}>Description:</label>
            <br />
            <input
              className="textPrimary"
              value={title}
              type="text"
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <br />
            <input
              className="buttonPrimary"
              type="button"
              id="add"
              value={id == 0 ? "Add" : "Update"}
              onClick={id == 0 ? saveExpense : updateExpense}
            />
            {id != 0 && (
              <button className="buttonPrimary marginAll" onClick={reset}>
                Cancel
              </button>
            )}
          </form>
          <hr />
        </div>
      )}
      {list.map((l: Expense) => {
        if (l) {
          return (
            <div key={l.id} style={{ marginBottom: "10px" }}>
              {(rights === "admin" || rights === "manager") && (
                <span style={{ marginRight: "5px" }}>
                  <button
                    className="buttonPrimary"
                    onClick={(e) => {
                      setId(l.id ? l.id : 0)
                      setAmount(l.amount)
                      setTitle(l.title)
                    }}
                  >
                    <FontAwesomeIcon size={"1x"} icon={faPencil} />
                  </button>{" "}
                  <button
                    className="buttonPrimary"
                    onClick={(e) => deleteExpense(l)}
                  >
                    <FontAwesomeIcon size={"1x"} icon={faTrash} />
                  </button>
                </span>
              )}
              <span style={{ fontSize: "1.4rem" }}>
                You spent {l.amount}/- for {l.title}
              </span>
            </div>
          )
        } else {
          return <></>
        }
      })}
    </Layout>
  )
}
