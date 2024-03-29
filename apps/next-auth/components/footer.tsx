import Link from "next/link"
import styles from "./footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://github.com/boxyhq/retraced-examples">GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href="/policy">
            <a>Policy</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <a href="https://github.com/retracedhq/retraced">
            Integrate Audit Logs with a few lines of code
          </a>
        </li>
      </ul>
    </footer>
  )
}
