import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml"
import { getAccessRights, getEvent } from "../../../components/helpers"
import AuditLogQueue from "../auditLogs/queue"

const samlLoginUrl =
  process.env.BOXYHQ_SAML_JACKSON_URL || "https://sso.eu.boxyhq.com"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    BoxyHQSAMLProvider({
      authorization: { params: { scope: "" } },
      issuer: samlLoginUrl,
      clientId: `tenant=boxyhq.com&product=${
        process.env.BOXYHQ_PRODUCT || "1eef7782-41d4-4a0a-b450-0857413b4f63"
      }`,
      clientSecret: "dummy",
    }),
    CredentialsProvider({
      id: "boxyhq-idp",
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "IdP Login",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        code: {
          label:
            "Code: Go to https://mocksaml.com/saml/login to initiate SAML IdP login",
          type: "text",
          placeholder: "Enter code",
        },
      },
      async authorize(credentials, req) {
        const { code } = credentials || {}

        if (!code) {
          return null
        }

        const res = await fetch(`${samlLoginUrl}/api/oauth/token`, {
          method: "POST",
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: "dummy",
            client_secret: "dummy",
            redirect_url: process.env.NEXTAUTH_URL,
            code,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (res.status !== 200) {
          return null
        }

        const json = await res.json()
        if (!json?.access_token) {
          return null
        }

        const resUserInfo = await fetch(`${samlLoginUrl}/api/oauth/userinfo`, {
          headers: {
            Authorization: `Bearer ${json.access_token}`,
          },
        })

        if (resUserInfo.status !== 200) {
          return null
        }
        const profile = await resUserInfo.json()
        if (profile?.id && profile?.email) {
          return {
            id: profile.id,
            email: profile.email,
            name: [profile.firstName, profile.lastName]
              .filter(Boolean)
              .join(" "),
            image: null,
          }
        }

        return null
      },
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const rights = getAccessRights(profile)

        AuditLogQueue.getInstance().enqueue(
          getEvent(
            "Log in",
            "r",
            rights,
            rights === "viewer"
              ? `(viewer - ${profile.firstName ? profile.firstName : ""})`
              : rights,
            "Home Page",
            "127.0.0.1",
            "Log in",
            "Home",
            undefined
          )
        )
      } catch (e) {
        console.log("Error saving event", e)
      }

      return true
    },
  },
})
