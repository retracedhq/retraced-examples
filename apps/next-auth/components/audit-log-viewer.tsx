import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import styles from "../components/layout.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useSession } from "next-auth/react"

export default function LogsList() {
  const { data: session, status } = useSession()
  const [logs, setLogs] = useState([])
  var lastStartTime = 0

  useEffect(() => {
    const intervalId = setInterval(async () => {
      await getLogs()
    }, 5000)
    return () => clearInterval(intervalId)
  }, [session])

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

  const getMetaString = (obj: any, crud: string): string[] => {
    //convert array of object containing key and value to object
    let newObj: any = {}
    ;(obj || []).forEach((o: any) => {
      newObj[o["key"]] = o["value"]
    })
    switch (crud) {
      case "c":
        return Object.keys(newObj).map((k) => {
          return `${k}: ${newObj[k]}`
        })
      case "d":
        return [`Expense for ${newObj["title"]} deleted!`]
      default:
        return []
    }
  }

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <h1>Audit Logs</h1>
        </div>
        <div className={styles.column}>
          <a href="/viewer" target="_blank">
            <p className={styles.alignRightLink}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                style={{ marginRight: "5px" }}
              />
              Open Logs Viewer
            </p>
          </a>
        </div>
      </div>
      <div className={styles.scrollable}>
        {logs.map((l: any, i) => {
          return (
            <div
              key={`log-${i}`}
              style={{
                border: "2px solid grey",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              <div
                style={{
                  backgroundColor: l["is_failure"]
                    ? "#e98a8a"
                    : l["is_new"]
                    ? "grey"
                    : "white",
                  padding: "10px",
                }}
              >
                <span>{formatEvent(l["display"]["markdown"])}</span>
                <br />
                {(l.fields || []).length > 0 && (
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
      </div>
    </div>
  )
}
