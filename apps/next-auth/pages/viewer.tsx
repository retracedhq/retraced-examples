import Layout from "../components/layout"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import axios from "axios"

const LogsViewer = dynamic(() => import("../components/logs-viewer"), {
  ssr: false,
})

export default function ViewerPage() {
  const [token, setToken] = useState<string>("")

  const getToken = async () => {
    axios
      .get(`/api/auditLogs/get?onlyToken=true`)
      .then((res) => {
        const token = res?.data?.token || ""
        setToken(token)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function render() {
    return (
      <div>
        <LogsViewer token={token} />
      </div>
    )
  }

  // render an error
  function renderError(err: any) {
    return <div>Could not initialize Audit Log: {err}</div>
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <Layout showLogs={false}>
      {token ? render() : renderError("No Token")}
    </Layout>
  )
}
