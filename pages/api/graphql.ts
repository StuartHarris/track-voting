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
      `database/search?q=${query}&genre=electronic&type=release`
    );
    return data.results;
  }
  async release(id: String) {
    return await this.get(`releases/${id}`);
  }
}

const typeDefs = gql`
  type Query {
    search(query: String!): [SearchResult!]!
    release(id: ID!): Release
    choices(id: ID): Choices
    top: TopResults
  }
  type SearchResult {
    id: ID!
    title: String!
    label: [String]
    cover_image: String
    year: String
    country: String
  }
  type TopResults {
    count: Int!
    scores: [Score]
  }
  type Score {
    title: String!
    value: Int!
  }
  type Release {
    id: ID!
    title: String!
    artists: [Artist]
    labels: [Label]
    notes: String
    released: String
    tracklist: [Track]
    images: [Image]
  }
  type Artist {
    name: String
  }
  type Label {
    catno: String
    name: String
  }
  type Image {
    resource_url: String
  }
  type Track {
    title: String!
    type_: String!
    duration: String
    position: String
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
    search: async (_source, { query }, { dataSources: { discogsAPI } }) => {
      return discogsAPI.search(query);
    },
    release: async (_source, { id }, { dataSources: { discogsAPI } }) => {
      return await discogsAPI.release(id);
    },
    choices: async (
      _source,
      { id: uuid },
      { dataSources: { firestore }, token }
    ) => {
      const id = token || uuid;

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
    top: async (_source, _args, { dataSources: { firestore } }) => {
      const documentPath = `/choices`;
      try {
        const docs = await firestore.documents().get({ documentPath });
        let count = 0;
        const scores: { [title: string]: number } = {};
        docs.documents.forEach((doc) => {
          count += 1;
          const c1: string = doc.fields.choice1;
          if (c1) {
            let score = scores[c1] || 0;
            score += 5;
            scores[c1] = score;
          }
          const c2: string = doc.fields.choice2;
          if (c2) {
            let score = scores[c2] || 0;
            score += 4;
            scores[c2] = score;
          }
          const c3: string = doc.fields.choice3;
          if (c3) {
            let score = scores[c3] || 0;
            score += 3;
            scores[c3] = score;
          }
          const c4: string = doc.fields.choice4;
          if (c4) {
            let score = scores[c4] || 0;
            score += 2;
            scores[c4] = score;
          }
          const c5: string = doc.fields.choice5;
          if (c5) {
            let score = scores[c5] || 0;
            score += 1;
            scores[c5] = score;
          }
        });
        const sorted = [];
        Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .forEach(([title, value]) => sorted.push({ title, value }));

        return { count, scores: sorted };
      } catch (error) {
        if (error.extensions?.response?.status === 404) return { count: 0 };
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
