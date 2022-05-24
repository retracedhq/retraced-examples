let defaultEvent = {
    "action": "test",
    "crud": "c",
    "group": {
        "id": "string",
        "name": "dev"
    },
    "displayTitle": "Title",
    "created": "2022-03-21T07:17:54",
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
export default function handler(req: any, res: any) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "token=dev_write");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ ...defaultEvent, ...req.body });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch("http://localhost:3000/auditlog/publisher/v1/project/dev/event", requestOptions)
        .then(response => response.text())
        .then(result => res.status(200).send(result))
        .catch(error => res.status(400).send(error));
}