import AuditLogQueue, { AuditLog } from "./queue"

let defaultEvent = {
  action: "test",
  crud: "c",
  group: {
    id: "string",
    name: "dev",
  },
  created: new Date()
    .toISOString()
    .slice(0, new Date().toISOString().length - 5),
  actor: {
    id: "string",
    name: "actor1",
    href: "string",
  },
  target: {
    id: "string",
    name: "target1",
    href: "target2",
    type: "target1",
  },
  source_ip: "127.0.0.1",
  description: "",
  is_anonymous: true,
  is_failure: false,
  fields: {},
  component: "",
  version: "v1",
}

const sleep = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, time)
  })
}

const worker = async () => {
  do {
    let log: AuditLog | undefined = AuditLogQueue.getInstance().dequeue()
    if (log) {
      await sendEventToService(log)
    } else {
      return
    }
  } while (true)
}

async function sendEventToService(log: AuditLog) {
  var myHeaders = new Headers()
  myHeaders.append("Authorization", "token=dev")
  myHeaders.append("Content-Type", "application/json")

  var raw = JSON.stringify({ ...defaultEvent, ...log })

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  }
  return new Promise((resolve) => {
    fetch(
      `${process.env.NEXT_PUBLIC_RETRACED_BASE_URL}/publisher/v1/project/dev/event`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result)
        resolve(true)
      })
      .catch((error) => {
        console.log(error)
        resolve(false)
      })
  })
}

AuditLogQueue.getInstance().on("newLog", async () => {
  await worker()
})

// TODO:
/*
 * Try bulk api
 */

export default function handler(req: any, res: any) {
  try {
    var raw: AuditLog = { ...defaultEvent, ...req.body }
    ;(raw.created = new Date()
      .toISOString()
      .slice(0, new Date().toISOString().length - 5)),
      AuditLogQueue.getInstance().enqueue(raw)
    res.status(200).send(true)
  } catch (ex) {
    res.status(400).json(ex)
  }
}
