import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import { getAccessRights, saveEvent } from "./helpers"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const rights = getAccessRights(session);
  const name = session?.user?.name?.split(" ")[0].toString();

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                className={styles.buttonPrimary}
                data-test-id="signInButton"
                onClick={(e) => {
                  e.preventDefault()
                  signIn("boxyhq-saml")
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                  saveEvent(
                    "Logout",
                    "r",
                    "dev",
                    "Logged Out",
                    (rights === "viewer" && name != "viewer")
                      ? `(viewer - ${session?.user?.name
                          ?.split(" ")[0]
                          .toString()})`
                      : rights,
                    "Header Component",
                    "127.0.0.1",
                    "",
                    "Header"
                  )
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
