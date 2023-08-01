import RetracedEventsBrowser from "@retracedhq/logs-viewer"

const LogsViewer = (props: { token: string }) => {
  const { token } = props

  return (
    <>
      {token && (
        <RetracedEventsBrowser
          auditLogToken={token}
          host={`${process.env.NEXT_PUBLIC_RETRACED_BASE_URL}/viewer/v1`}
          header="Audit Logs"
        />
      )}
    </>
  )
}

export default LogsViewer
