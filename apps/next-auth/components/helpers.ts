import axios from "axios"
import pjson from "../../../package.json"
import { AuditLog } from "../pages/api/auditLogs/queue"

export const getEvent = (
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
): AuditLog => {
  const event: any = {
    action: action,
    crud: crud,
    group: {
      id: "retraced-demo",
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

  return event as AuditLog
}

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
  const event = getEvent(
    action,
    crud,
    group,
    actor,
    target,
    source_ip,
    description,
    component,
    meta,
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
