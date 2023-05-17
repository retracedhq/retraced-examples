import axios from "axios"
export const saveEvent = (
  action: string,
  crud: string,
  group: string,
  actor: string,
  target: string,
  source_ip: string,
  description: string,
  component: string,
  meta?: any
) => {
  axios
    .post(`/api/auditLogs/save`, {
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
      fields: convertFields(meta || {}),
      component: component,
      version: "v1",
    })
    .then((res) => {})
}

const convertFields = (fields: any) => {
  const ret: any = {}
  for (const key in fields) {
    if (fields.hasOwnProperty(key)) {
      const element = fields[key]
      switch (typeof element) {
        case "string":
        case "number":
        case "boolean":
          ret[key] = element.toString()
          break
        case "object":
          ret[key] = JSON.stringify(element)
          break
        default:
          ret[key] = element.toString()
      }
    }
  }
  return ret
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
