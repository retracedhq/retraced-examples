import AuditLogQueue, { AuditLog } from './queue';

let defaultEvent = {
    "action": "test",
    "crud": "c",
    "group": {
        "id": "string",
        "name": "dev"
    },
    "displayTitle": "Title",
    "created": new Date().toISOString().slice(0, new Date().toISOString().length - 5),
    "actor": {
        "id": "string",
        "name": "actor1",
        "href": "string"
    },
    "target": {
        "id": "string",
        "name": "target1",
        "href": "target2",
        "type": "target1"
    },
    "source_ip": "127.0.0.1",
    "description": "",
    "is_anonymous": true,
    "is_failure": false,
    "fields": {},
    "component": "",
    "version": "v1"
};

const sleep = async (time: number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(undefined); }, time)
    });
}

const worker = async () => {
    do {
        let log: AuditLog | undefined = AuditLogQueue.getInstance().dequeue();
        if (log) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "token=dev_write");
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ ...defaultEvent, ...log });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
            };

            fetch("http://localhost:3000/auditlog/publisher/v1/project/dev/event", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log(error));
        } else {
            await sleep(500);
        }
    } while (true);
}

// TODO:
/*
 * Try bulk api
 */

export default function handler(req: any, res: any) {
    try {
        var raw: AuditLog = { ...defaultEvent, ...req.body };
        console.log("raw", raw);
        raw.created = new Date().toISOString().slice(0, new Date().toISOString().length - 5),
            AuditLogQueue.getInstance().enqueue(raw);
        res.status(200).send(true)
    } catch (ex) {
        res.status(400).json(ex);
    }
}

worker();