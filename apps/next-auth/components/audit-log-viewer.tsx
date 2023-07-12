import { useEffect, useState } from "react"
import axios from "axios"

export default function AccessDenied() {
  const [logs, setLogs] = useState([])
  var lastStartTime = 0
  useEffect(() => {
    worker()
  }, [])

  const worker = async () => {
    setInterval(async () => {
      await getLogs()
    }, 5000)
  }

  const getLogs = async () => {
    return new Promise((resolve) => {
      axios
        .get(
          `/api/auditLogs/get?startTime=${+new Date(
            new Date().setDate(new Date().getDate() - 1)
          )}&endTime=${+new Date(new Date().setDate(new Date().getDate() + 1))}`
        )
        .then((res) => {
          const events: [] = res.data
          if (Array.isArray(events)) {
            if (lastStartTime == 0) {
              if (events.length > 0) {
                const temp = events.filter((e) => e["created"]).slice(0, 20)
                setLogs(temp)
                lastStartTime = +new Date(temp[0]["created"])
              }
            } else {
              let tmp: any[] = events
              if (tmp.length > 0) {
                let final: never[] = tmp
                  .filter((e) => e && e.created)
                  .map((t) => {
                    if (+new Date(t["created"].toString()) > lastStartTime) {
                      return { ...t, is_new: true }
                    } else {
                      return { ...t, is_new: false }
                    }
                  }) as never[]
                lastStartTime = +new Date(final[0]["created"])
                setLogs(final.slice(0, 20))
                resolve(true)
              }
            }
          }
        })
        .catch(() => {
          resolve(true)
        })
    })
  }

  const formatEvent = (input: string) => {
    return input.replaceAll("**", "")
  }

  return (
    <div>
      <h1>Logs</h1>
      <div>
        {logs.map((l, i) => {
          return (
            <div
              key={i}
              style={{
                border: "2px solid grey",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  backgroundColor: l["is_new"] ? "grey" : "white",
                  padding: "10px",
                }}
              >
                <span>{formatEvent(l["display"]["markdown"])}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
