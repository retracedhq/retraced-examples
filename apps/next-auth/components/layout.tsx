import Header from "./header"
import Footer from "./footer"
import LogsViewer from "./audit-log-viewer"
import styles from "./layout.module.css"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className={styles.layoutDiv}>
        <div className={styles.row}>
          <div className={styles.column}>
            <main>{children}</main>
          </div>
          <div className={styles.logsColumn}>
            <LogsViewer />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
