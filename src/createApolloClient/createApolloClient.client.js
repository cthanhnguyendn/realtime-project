import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';

const wsGqlURL =
  process.env.NODE_ENV !== 'production'
    ? `ws://localhost:8181/subscriptions`
    : `ws://example.com:8181`;

const networkInterface = createNetworkInterface({
  uri: '/graphql',
  opts: {
    // Additional fetch options like `credentials` or `headers`
    credentials: 'include',
  },
});

const wsClient = new SubscriptionClient(wsGqlURL, {
  reconnect: true,
  connectionParams: {},
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  queryDeduplication: true,
  reduxRootSelector: state => state.apollo,
});

export default function createApolloClient() {
  return client;
}
