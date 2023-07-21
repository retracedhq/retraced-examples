import Header from "./header"
import Footer from "./footer"
import LogsViewer from "./audit-log-viewer"
import styles from "./layout.module.css"
import { useSession } from "next-auth/react"
import { getAccessRights } from "./helpers"

interface Props {
  children: React.ReactNode
  showLogs?: boolean
}

export default function Layout({ children, showLogs = true }: Props) {
  const { data: session, status } = useSession()
  const rights = getAccessRights(session?.user)
  return (
    <>
      <Header />
      <div className={styles.layoutDiv}>
        <div className={styles.row}>
          <div className={styles.column}>
            <main>{children}</main>
          </div>
          {showLogs && (
            <div className={styles.logsColumn}>
              <LogsViewer />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
