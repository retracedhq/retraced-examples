import Layout from "../../components/layout"
import saveEvent from "../../components/saveEvent"

export default function Page() {
    // saveEvent(
    //     "Logged In as Admin",
    //     "r",
    //     "dev",
    //     "Login Successful!",
    //     "unknown",
    //     "Admin Page",
    //     "127.0.0.1",
    //     "",
    //     "Admin"
    //   )
  return (
    <Layout>
      <h1>This page is protected by Middleware</h1>
      <p>Only admin users can see this page.</p>
      <p>
        To learn more about the NextAuth middleware see&nbsp;
        <a href="https://docs-git-misc-docs-nextauthjs.vercel.app/configuration/nextjs#middleware">
          the docs
        </a>
        .
      </p>
    </Layout>
  )
}
