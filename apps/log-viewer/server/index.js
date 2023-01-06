const cors = require('cors');
const express = require('express');
const Chance = require('chance');
const Retraced = require('@retracedhq/retraced');
const app = express();

const chance = new Chance();
const actions = [
  'license.update',
  'spline.reticulate',
  'user.login',
  'release.promote',
  'wozniak.bore',
  'page.load',
];

const ips = ['192.168.1.1', '200.168.1.10', '12.18.12.13', '92.68.51.21'];

// require api token / project to start
if (!process.env.RETRACED_API_TOKEN || !process.env.RETRACED_PROJECTID) {
  console.log('ERROR cannot start without RETRACED_API_TOKEN and RETRACED_PROJECTID');
  process.exit(1);
}

// Initialize our retraced client
const retraced = new Retraced.Client({
  apiKey: process.env.RETRACED_API_TOKEN,
  projectId: process.env.RETRACED_PROJECTID,
  endpoint: process.env.RETRACED_HOST,
});

app.use(cors());

app.get('/api/viewertoken', async (req, res) => {
  // Use the team ID from the request.
  // For production usage, we'd want to use Auth info in the
  // request to determine the team (i.e. end customer) in a multi-tenant SaaS app
  if (!req.query.team_id) {
    res.status(400).send(JSON.stringify({ error: "Missing query param 'team_id'" }));
    return;
  }

  // Use a random actor name/id
  // For production usage, we'd want to use Auth info in the
  // request to determine the actor
  let actor_id = chance.guid();
  let actor_name = chance.name();

  // use a random action
  let randomAction = actions[chance.integer({ min: 0, max: actions.length - 1 })];

  // use random ips
  let randomIPs = ips[chance.integer({ min: 0, max: ips.length - 1 })];

  // Report an event on every page load
  retraced.reportEvent({
    crud: 'u',
    action: randomAction,
    description: 'user <anonymous> reticulated the splines',
    created: new Date().toISOString(),
    actor: {
      id: actor_id,
      name: actor_name,
    },
    group: {
      id: req.query.team_id,
      name: req.query.team_id,
    },
    sourceIp: randomIPs,
  });

  // Get A viewer token and send it to the client
  // the client will use this token to initialize the viewer
  console.log('Requesting viewer token for team', req.query.team_id);

  retraced
    .getViewerToken(req.query.team_id, actor_id, true)
    .then((t) => res.send(JSON.stringify({ token: t, host: `${process.env.RETRACED_HOST}/viewer/v1` })))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ error: 'An Unexpected Error Occured' });
    });
});

// if `yarn build` was used to create a production js/html build, serve that too.
app.use(express.static('build'));

// serve on env.PORT or 3030
const port = Number(process.env.PORT || '3030');
app.listen(3030, '0.0.0.0', () => {
  console.log(`Listening on port ${port}`);
});
