import styles from "./viewer.layout.module.css"
import { useSession } from "next-auth/react"
import { getAccessRights } from "./helpers"

interface Props {
  children: React.ReactNode
}

export default function ViewerLayout({ children }: Props) {
  const { data: session, status } = useSession()
  const rights = getAccessRights(session?.user)
  return (
    rights && (
      <>
        <div className={styles._layoutDiv}>
          <div className={styles.flexrow}>
            <div className={styles.flexcolumn}>
              <main>{children}</main>
            </div>
          </div>
        </div>
      </>
    )
  )
}
