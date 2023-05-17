import { useEffect, useState } from "react"
import axios from "axios"

export default function AccessDenied() {
  const [logs, setLogs] = useState([])
  var lastStartTime = 0
  useEffect(() => {
    getLogs()
    setInterval(() => {
      getLogs()
    }, 2500)
  }, [])
  const getLogs = () => {
    axios
      .get(
        `/api/auditLogs/get?startTime=${+new Date(
          new Date().setDate(new Date().getDate() - 1)
        )}&endTime=${+new Date(new Date().setDate(new Date().getDate() + 1))}`
      )
      .then((res) => {
        const events: [] = res.data.events
        if (Array.isArray(events)) {
          if (lastStartTime == 0) {
            if (events.length > 0) {
              const temp = events
                .filter((e) => e["created"])
                .reverse()
                .slice(0, 20)
              setLogs(temp)
              lastStartTime = parseInt(temp[0]["created"])
            }
          } else {
            let tmp: any[] = events.reverse()
            if (tmp.length > 0) {
              let final: never[] = tmp
                .filter((e) => e && e.created)
                .map((t) => {
                  if (parseInt(t["created"].toString()) > lastStartTime) {
                    return { ...t, is_new: true }
                  } else {
                    return { ...t, is_new: false }
                  }
                }) as never[]
              lastStartTime = parseInt(final[0]["created"])
              setLogs(final.slice(0, 20))
            }
          }
        }
      })
  }

  const formatEvent = (input: string) => {
    let found = false
    do {
      if (input.indexOf("**") != -1) {
        if (!found) {
          input = input.replace("**", "")
          found = true
        } else {
          input = input.replace("**", "")
          found = false
        }
      } else {
        return input
      }
    } while (true)
  }

  const getMetaString = (obj: any, crud: string): string[] => {
    switch (crud) {
      case "u":
        const updates = JSON.parse(obj.updates)
        return Object.keys(updates).map((k) => {
          return `Updated ${k}: ${updates[k]}`
        })
      case "d":
        return [`Expense for ${obj["title"]} deleted!`]
      default:
        return []
    }
  }

  return (
    <div>
      <h1>Logs</h1>
      <p>
        {logs.map((l, i) => {
          return (
            <div
              key={i}
              style={{ border: "2px solid grey", marginBottom: "10px" }}
            >
              <div
                style={{
                  backgroundColor: l["is_new"] ? "grey" : "white",
                  padding: "10px",
                }}
              >
                <span>{formatEvent(l["display"]["markdown"])}</span>
                <br />
                {Object.keys(l["fields"] || {}).length > 0 && (
                  <>
                    <br />
                    <span>
                      {getMetaString(l["fields"], l["crud"]).map((m) => {
                        return (
                          <div>
                            <u>{m}</u>
                          </div>
                        )
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </p>
    </div>
  )
}
