import axios from "axios"
import pjson from "../../../package.json"

export const saveEvent = async (
  action: string,
  crud: string,
  group: string,
  actor: string,
  target: string,
  source_ip: string,
  description: string,
  component: string,
  meta?: any,
  externalId?: string
) => {
  const event: any = {
    action: action,
    crud: crud,
    group: {
      id: "string",
      name: group,
    },
    created: "2022-03-21T07:17:54",
    actor: {
      id: "string",
      name: actor,
      href: "string",
    },
    target: {
      id: "string",
      name: target,
      href: "target2",
      type: "target1",
    },
    source_ip: source_ip,
    description: description,
    is_anonymous: true,
    is_failure: false,
    component: component,
    version: pjson.version,
  }

  if (meta) {
    event.fields = meta
  }

  if (externalId) {
    event.external_id = externalId
  }

  await axios.post(`/api/auditLogs/save`, event)
}

export const getAccessRights = (session: any): string => {
  if (session) {
    if (session.user) {
      switch (session.user.email.toLowerCase().split("@")[0]) {
        case "admin":
          return "admin"
        case "manager":
          return "manager"
        case "viewer":
          return "viewer"
        default:
          return "viewer"
      }
    } else {
      return ""
    }
  }
  return ""
}
