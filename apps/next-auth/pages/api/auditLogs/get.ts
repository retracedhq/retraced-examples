export default function handler(req: any, res: any) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "token=dev_read");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "query": {
            "search_text": "",
            "offset": 0,
            "length": 20,
            "start_time": req.body.startTime,
            "end_time": req.body.endTime,
            "create": "c",
            "read": "r",
            "update": "u",
            "delete": "d"
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch("http://localhost:3000/auditlog/admin/v1/project/dev/events/search?environment_id=dev", requestOptions)
        .then(response => response.text())
        .then(result => res.status(200).send(result))
        .catch(error => res.status(400).send(error));
}