import { useEffect, useState } from "react"
import axios from "axios"

export default function AccessDenied() {
  const [logs, setLogs] = useState([])
  useEffect(() => {
    getLogs()
    setInterval(() => {
      getLogs()
    }, 5000)
  }, [])
  const getLogs = () => {
    axios
      .get(
        `/api/logs/get?startTime=${+new Date(
          new Date().setDate(new Date().getDate() - 1)
        )}&endTime=${+new Date(new Date().setDate(new Date().getDate() + 1))}`
      )
      .then((res) => {
        const events: [] = res.data.events
        setLogs(events.reverse())
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

  return (
    <div>
      <h1>Logs</h1>
      <p>
        {logs.map((l, i) => {
          return (
            <div key={i}>
              <div>
                <span>{formatEvent(l["display"]["markdown"])}</span>
              </div>
            </div>
          )
        })}
      </p>
    </div>
  )
}
