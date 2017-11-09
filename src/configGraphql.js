import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import config from './config';

export default (server, schema) => {
  server.use(
    '/graphql',
    graphqlExpress(req => ({
      schema,
      debug: __DEV__,
      rootValue: { request: req },
      context: {
        request: req,
        user: req.user,
      },
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
          code:
            (error.originalError && error.originalError.code) || 'UNDEFINED',
          stack:
            process.env.NODE_ENV === 'development'
              ? error.stack.split('\n')
              : null,
        };
      },
    })),
  );
  server.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: config.wsGqlURL,
    }),
  );
};
