import axios from "axios"
import packageJSON from "../package.json"
import { AuditLog } from "../pages/api/auditLogs/queue"

export const getEvent = (
  action: string,
  crud: string,
  role: string,
  actor: string,
  target: string,
  source_ip: string,
  description: string,
  component: string,
  meta?: any,
  failure: boolean = false,
  externalId?: string
): AuditLog => {
  const event: any = {
    action: action,
    crud: crud,
    group: {
      id: process.env.NEXT_PUBLIC_GROUP_ID,
      name: "Retraced Demo",
    },
    created: new Date().toISOString(),
    actor: {
      id: actor,
      name: actor,
    },
    target: {
      id: target,
      name: target,
    },
    source_ip: source_ip,
    description: description,
    is_failure: failure,
    component: component,
    version: packageJSON.version,
  }

  if (meta) {
    event.fields = meta
  }

  if (externalId) {
    event.external_id = externalId
  }

  if (role) {
    if (!event.fields) {
      event.fields = {}
    }
    event.fields.role = role
  }

  return event as AuditLog
}

export const saveEvent = async (
  action: string,
  crud: string,
  role: string,
  actor: string,
  target: string,
  source_ip: string,
  description: string,
  component: string,
  fields?: any,
  failure: boolean = false,
  externalId?: string
) => {
  const event = getEvent(
    action,
    crud,
    role,
    actor,
    target,
    source_ip,
    description,
    component,
    fields,
    failure,
    externalId
  )
  await axios.post(`/api/auditLogs/save`, event)
}

export const getAccessRights = (user: any): string => {
  if (user && user.email) {
    switch (user.email.toLowerCase().split("@")[0]) {
      case "admin":
        return "admin"
      case "manager":
        return "manager"
      case "viewer":
        return "viewer"
      default:
        return "viewer"
    }
  }

  return ""
}
