export type AuditLog = {
  action: string
  crud: string
  group: {
    id: string
    name: string
  }
  created: string
  actor: {
    id: string
    name: string
    href: string
  }
  target: {
    id: string
    name: string
    href: string
    type: string
  }
  source_ip: string
  description: string
  is_anonymous: boolean
  is_failure: boolean
  fields: any
  component: string
  version: string
}

export default class AuditLogQueue {
  private queue: AuditLog[] = []
  private static instance: AuditLogQueue
  private constructor() {}
  public static getInstance(): AuditLogQueue {
    if (!AuditLogQueue.instance) {
      AuditLogQueue.instance = new AuditLogQueue()
    }
    return AuditLogQueue.instance
  }

  public enqueue(log: AuditLog) {
    this.queue.push(log)
    console.log(`Added Audit Log to Queue`)
  }

  public dequeue(): AuditLog | undefined {
    let log = this.queue.pop()
    if (log) {
      console.log(`Saving Audit Log to retraced`)
    }
    return log
  }
}
