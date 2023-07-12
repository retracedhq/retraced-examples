export default async function handler(req: any, res: any) {
  try {
    const token = await getViewerToken()
    const session = await getViewerSession(token)
    const logs = await getAuditLogs(session)
    res.status(200).send(logs)
  } catch (ex) {
    res.status(400).json(ex)
  }
}

const getViewerToken = async () => {
  try {
    var myHeaders = new Headers()
    myHeaders.append("Authorization", "Token token=dev")

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    } as any

    const resp = await fetch(
      `${process.env.RETRACED_BASE_URL}/publisher/v1/project/dev/viewertoken?group_id=${process.env.NEXT_PUBLIC_GROUP_ID}&actor_id=admin&isAdmin=true`,
      requestOptions
    )
    const json = await resp.json()
    return json.token
  } catch (ex) {
    console.log(ex)
  }
}

const getViewerSession = async (token: string) => {
  try {
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    var raw = JSON.stringify({
      token,
    })

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    } as any

    const res = await fetch(
      `${process.env.RETRACED_BASE_URL}/viewer/v1/viewersession`,
      requestOptions
    )
    const json = await res.json()
    return json.token
  } catch (ex) {
    console.log(ex)
  }
}

const getAuditLogs = async (session: string) => {
  try {
    var myHeaders = new Headers()
    myHeaders.append("Authorization", session)
    myHeaders.append("Content-Type", "application/json")

    var raw = JSON.stringify({
      query:
        "\n            query Search($query: String!, $last: Int, $before: String) {\n              search(query: $query, last: $last, before: $before) {\n                totalCount\n                pageInfo {\n                  hasPreviousPage\n                }\n                edges {\n                  cursor\n                  node {\n                    id\n                    action\n                    crud\n                    created\n                    received\n                    canonical_time\n                    description\n                    actor {\n                      id\n                      name\n                      href\n                    }\n                    group {\n                      id\n                      name\n                    }\n                    target {\n                      id\n                      name\n                      href\n                      type\n                    }\n                    display {\n                      markdown\n                    }\n                    is_failure\n                    is_anonymous\n                    source_ip\n                    country\n                    loc_subdiv1\n                    loc_subdiv2\n                  }\n                }\n              }\n            }\n          ",
      variables: {
        query: "crud:c,u,d",
        last: 20,
        before: "",
      },
    })

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    } as any

    const res = await fetch(
      `${process.env.RETRACED_BASE_URL}/viewer/v1/graphql`,
      requestOptions
    )
    const json = await res.json()
    return json.data.search.edges.map((d: any) => d.node)
  } catch (ex) {
    return []
  }
}
