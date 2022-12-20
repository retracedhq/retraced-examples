import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RetracedEventsBrowser from '@retraced-hq/logs-viewer';

const url = `http://localhost:3030/api/viewertoken?team_id=dev`;

// render the events browser
function render(token) {
  ReactDOM.render(
    <RetracedEventsBrowser auditLogToken={token} host={'http://localhost:3000/auditlog/viewer/v1'} />,
    document.getElementById('root')
  );
}

// render an error
function renderError(err) {
  ReactDOM.render(<div>Could not initialize Audit Log: {err}</div>, document.getElementById('root'));
}

// get the token, then use it to render the browser
fetch(url, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
})
  .then((resp) => {
    resp
      .json()
      .then((body) => {
        render(body.token);
      })
      .catch(renderError);
  })
  .catch(renderError);
