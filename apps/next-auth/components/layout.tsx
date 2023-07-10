import Header from "./header"
import Footer from "./footer"
import LogsViewer from "./audit-log-viewer"
import styles from "./layout.module.css"
import { useSession } from "next-auth/react"
import { getAccessRights } from "./helpers"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
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
          {rights === "admin" && (
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
