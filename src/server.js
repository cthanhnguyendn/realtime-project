/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import Promise from 'bluebird';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import morgan from 'morgan';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import configureStore from './store/configureStore';
import passport from './security/passport';
import {
  securityRouter,
  parseJwtRequest,
  authenErrorHandle,
} from './security/securityRouter';
import router from './router';
import models from './data/models';
import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import createApolloClient from './createApolloClient';
import { setRuntimeVariable } from './actions/runtime';
import { getDataFromTree } from 'react-apollo';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
if (__DEV__) {
  app.use(morgan('combined'));
}
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//
// Authentication
// -----------------------------------------------------------------------------
app.use(parseJwtRequest);
// Error handler for express-jwt
app.use(authenErrorHandle);
app.use(passport.initialize());
app.use(securityRouter);

if (__DEV__) {
  app.enable('trust proxy');
}

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
    formatError: error => {
      // req.ravenAddContext({
      //   extra: {
      //     source: error.source && error.source.body,
      //     positions: error.positions,
      //     path: error.path,
      //   },
      // });
      if (error.path || error.name !== 'GraphQLError') {
        // req.ravenAddContext({ tags: { graphql: 'exec_error' } });
        // raven.captureException(error, req.ravenGetContext());
        console.error(error);
      } else {
        // req.ravenAddContext({ tags: { graphql: 'wrong_query' } });
        // raven.captureMessage(`GraphQLWrongQuery: ${error.message}`, req.ravenGetContext());
        console.error(error);
      }
      return {
        message: error.message,
        code: (error.originalError && error.originalError.code) || 'UNDEFINED',
        stack:
          process.env.NODE_ENV === 'development'
            ? error.stack.split('\n')
            : null,
      };
    },
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    const initialState = {
      user: req.user || null,
    };
    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });
    const store = configureStore(initialState, {
      cookie: req.headers.cookie,
      apolloClient,
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
      history: null,
    });
    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Universal HTTP client
      fetch,
      store,
      client: apolloClient,
    };

    const route = await router.resolve({
      ...context,
      pathname: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    const rootComponent = (
      <App context={context} store={store}>
        {route.component}
      </App>
    );
    await getDataFromTree(rootComponent);
    // this is here because of Apollo redux APOLLO_QUERY_STOP action
    await Promise.delay(0);

    data.children = await ReactDOM.renderToString(rootComponent);
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
  module.hot.accept('./data/schema');
  // module.hot.accept('./passport');
}

export default app;
