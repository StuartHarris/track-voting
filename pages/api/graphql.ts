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
  async versions(master_id: String) {
    return await this.get(`masters/${master_id}/versions`);
  }
  async tracks(release_id: String) {
    return await this.get(`releases/${release_id}`);
  }
}

const typeDefs = gql`
  type Query {
    masters(search: String!): [Master!]!
    versions(master_id: ID!): [Version!]!
    tracks(release_id: ID!): [Track!]!
    choices(id: ID): Choices
  }
  type Master {
    id: ID!
    title: String!
    cover_image: String
    year: String
    country: String
  }
  type Version {
    id: ID!
    title: String!
    label: String!
    released: String!
  }
  type Track {
    title: String!
    duration: String!
    position: String!
  }
  type Choices {
    id: ID!
    choice1: String
    choice2: String
    choice3: String
    choice4: String
    choice5: String
  }
  type Mutation {
    choices(
      id: ID
      choice1: String
      choice2: String
      choice3: String
      choice4: String
      choice5: String
    ): Choices
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
    versions: async (
      _source,
      { master_id },
      { dataSources: { discogsAPI } }
    ) => {
      const data = await discogsAPI.versions(master_id);
      return data.versions;
    },
    tracks: async (
      _source,
      { release_id },
      { dataSources: { discogsAPI } }
    ) => {
      const data = await discogsAPI.tracks(release_id);
      return data.tracklist;
    },
    choices: async (
      _source,
      { id: uuid },
      { dataSources: { firestore }, token }
    ) => {
      const id = token || uuid;
      console.log({ id });

      if (id == null) return null;
      const documentPath = `/choices/${id}`;
      try {
        const doc = await firestore.documents().get({ documentPath });
        return doc.fields;
      } catch (error) {
        if (error.extensions?.response?.status === 404) return { id };
        console.log({ error: JSON.stringify(error) });
        return error;
      }
    },
  },
  Mutation: {
    choices: async (
      _source,
      { id: uuid, choice1, choice2, choice3, choice4, choice5 },
      { dataSources: { firestore }, token }
    ) => {
      const id = token || uuid;
      if (id == null) return null;
      const documentPath = `/choices/${id}`;

      try {
        const doc = await firestore.documents().update({
          documentPath,
          // fieldsToReturn: ["id", "choice1"],
          data: {
            fields: {
              id: {
                stringValue: id,
              },
              choice1: {
                stringValue: choice1 || "",
              },
              choice2: {
                stringValue: choice2 || "",
              },
              choice3: {
                stringValue: choice3 || "",
              },
              choice4: {
                stringValue: choice4 || "",
              },
              choice5: {
                stringValue: choice5 || "",
              },
            },
          },
          updateOptions: {
            updateAll: true,
          },
        });
        return doc?.fields;
      } catch (error) {
        console.log({ error: JSON.stringify(error) });
        return error;
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
  context: ({ req }) => ({
    token: req.cookies["token"],
    key: process.env["DISCOGS_KEY"],
    secret: process.env["DISCOGS_SECRET"],
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api/graphql" });
