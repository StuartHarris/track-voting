import { ApolloServer, gql } from "apollo-server-micro";
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import FireSource from "@devskope/apollo-firesource";
import fs from "fs";

fs.writeFileSync(
  process.env.FIRESOURCE_CREDENTIALS,
  Buffer.from(process.env.FIRESTORE_SA, "base64")
);

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
    choices: [Choice!]!
  }
  type Master {
    title: String!
    id: ID!
    cover_image: String
    year: String
    country: String
  }
  type Choice {
    choice1: String
    choice2: String
    choice3: String
  }
  type Mutation {
    top3(one: String, two: String, three: String): ID!
  }
`;

const resolvers = {
  Query: {
    masters: async (
      _source,
      { search: query },
      { dataSources: { discogsAPI } }
    ) => {
      return discogsAPI.search(query);
    },
    choices: async (
      _source,
      { search: _query },
      { dataSources: { firestore } }
    ) => {
      try {
        const docs = await firestore.documents().get({
          collectionPath: "/choices",
        });
        return docs.documents.map((doc) => doc.fields);
      } catch (error) {
        console.log(JSON.stringify(error));
        return [];
      }
    },
  },
  Mutation: {
    top3: async (_source, { documentPath }, { dataSources: { firestore } }) => {
      try {
        // get document by id from collection
        return firestore.documents().get({ documentPath });
      } catch (error) {
        /* handle error
         *
         * Ideally first handle Firestore error responses:
         *   error.extensions?.response - exception details
         *
         * Then FireSource Errors:
         *   error.extensions.code === <'BAD_USER_INPUT'|'UNAUTHENTICATED'>
         *   error.message - exception details
         */
      }
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      discogsAPI: new DiscogsAPI(),
      firestore: new FireSource({
        projectId: "track-voting",
      }),
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
