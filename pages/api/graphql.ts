import { ApolloServer, gql } from "apollo-server-micro";
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

class DiscogsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.discogs.com";
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set(
      "Authorization",
      `Discogs key=${this.context.key}, secret=${this.context.secret}`
    );
    request.headers.set(
      "User-Agent",
      "TrackVoting/0.1 +https://track-voting.vercel.app/"
    );
    request.headers.set("Accept", "application/vnd.discogs.v2.html+json");
  }

  async search(query: String) {
    const data = await this.get(
      `database/search?q=${query}&genre=electronic&type=master`
    );
    return data.results;
  }
}

const typeDefs = gql`
  type Query {
    masters(search: String!): [Master!]!
  }
  type Master {
    title: String!
    id: ID!
    thumb: String
    year: String
    country: String
  }
`;

const resolvers = {
  Query: {
    masters: async (_source, { search: query }, { dataSources }) => {
      return dataSources.discogsAPI.search(query);
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      discogsAPI: new DiscogsAPI(),
    };
  },
  context: () => {
    return {
      key: process.env["DISCOGS_KEY"],
      secret: process.env["DISCOGS_SECRET"],
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
