/*
 *
 *     Copyright 2018 InfAI (CC SES)
 *
 *     Licensed under the Apache License, Version 2.0 (the “License”);
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an “AS IS” BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */

// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const request = require('request-promise');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Point static path to dist

//get kong endpoint
app.get("/settings.js", (req, res) => {
  const keycloak = process.env.KEYCLOAK_URL || "http://keycloak";
  const client_id = process.env.CLIENT_ID || "auth-frontend";
  const kong_url = process.env.KONG_URL || "http://kong";
  const kong_admin_url = process.env.KONG_ADMIN_URL || "http://kongadmin";
  const kong_username = process.env.KONG_ADMIN_USERNAME;
  const kong_password = process.env.KONG_ADMIN_PASSWORD;
  request({
    headers: {
      'Authorization' : 'Basic ' + Buffer.from(kong_username+ ":" + kong_password).toString('base64')
    },
    uri: kong_admin_url + "/routes",
    method: 'GET'
  }).then(function(kong_uris) {
    kong_uris = JSON.parse(kong_uris)["data"].map(function(uri) {
      return uri["paths"][0]
    });

    res.send("var KEYCLOAK_URL = '" + keycloak + "';var CLIENT_ID = '" + client_id + "';var KONG_URL = '" + kong_url + "';var KONG_URIS = '" + JSON.stringify(kong_uris) + "';");
  })
});


// This will load all static files ("/" -> /dist/index.html, "/styles/styles.css" -> /dist/styles/styles.css) 
app.use("/", express.static(__dirname + '/dist'));

// This will load all Angular routes to the index.html ("/processes" -> /dist/index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
