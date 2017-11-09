import http from 'http';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import config from './config';
import { client } from './message/redis';
import schema from './data/schema';

let server; // eslint-disable-line
const cookieKey = config.COOKIE_NAME;

if (!__DEV__) {
  console.warn('SETUP TLS FOR PRODUCTION IN WEBSOCKET'); // eslint-disable-line
}

if (!server) {
  server = http.createServer((req, res) => {
    res.writeHead(400);
    res.end();
  });

  server.listen(config.websocketPort, () => {
    console.info(
      `Websocket server is running at http://localhost:${config.websocketPort}/`,
    );
    console.info(
      `API Server over web socket with subscriptions is now running on ws://localhost:${config.websocketPort}${config.subcriptionPath}`,
    ); // eslint-disable-line no-console
  });
  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      // onOperation: async (msg, params, socket) =>
      //   new Promise(resolve => {
      //     const query = params.query;
      //     if (query && query.length > 2000) {
      //       throw new Error('Query too long');
      //     }
      //
      //     /* get session and log user in */
      //     if (socket.upgradeReq) {
      //       let session = {};
      //       const cookies = cookie.parse(socket.upgradeReq.headers.cookie);
      //       const sessionID = cookieParser.signedCookie(
      //         cookies[cookieKey],
      //         config.SECRET_KEY,
      //       );
      //
      //       const baseContext = {
      //         context: {
      //           user: null,
      //         },
      //       };
      //
      //       const paramsWithFulfilledBaseContext = {
      //         ...params,
      //         ...baseContext,
      //       };
      //
      //       // resolve early
      //       if (!sessionID) {
      //         resolve(paramsWithFulfilledBaseContext);
      //         return;
      //       }
      //
      //       // get session from redis
      //       client.get(`sess:${sessionID}`, (err, sessionJSON) => {
      //         if (err) {
      //           console.error(err);
      //           throw new Error('Failed to fetch session from store');
      //         }
      //         if (sessionJSON) {
      //           session = JSON.parse(sessionJSON);
      //         }
      //         const { passport: { user = null } = {} } = session;
      //
      //         resolve({
      //           ...paramsWithFulfilledBaseContext,
      //           context: {
      //             ...paramsWithFulfilledBaseContext.context,
      //             user,
      //           },
      //         });
      //       });
      //     }
      //   }),
    },
    {
      server,
      path: config.subcriptionPath,
    },
  );
}

export default server;
