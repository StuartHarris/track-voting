import { ApolloServer, gql } from "apollo-server-micro";
import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";
import FireSource from "@devskope/apollo-firesource";
import fs from "fs";
import slug from "slug";

const REMOVE_LIST = new RegExp(
  "\\b((mix)|(remix)|(edit)|(original)|(dub)|(the)|(a))\\b",
  "ig"
);

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
    track: [String!]
    score: Int!
    votes: Int!
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
      const collectionPath = `/choices`;
      try {
        const docs = await firestore
          .documents()
          .list({ collectionPath, queryOptions: { pageSize: 1000 } });

        let count = 0;
        const scores: {
          [track: string]: { track: Set<string>; score: number; votes: number };
        } = {};
        docs.documents.forEach((doc) => {
          count += 1;
          function add(field: string, weight: number) {
            const name = doc.fields[field];
            if (name) {
              const s: string = slug(
                name
                  .split(" – ")[1]
                  .replace('12"', "")
                  .replace("TdV", "tony de vit")
                  .replace("'s ", ""),
                {
                  remove: REMOVE_LIST,
                }
              );

              let { track, score, votes } = scores[s] || {
                track: new Set(),
                score: 0,
                votes: 0,
              };
              score += weight;
              votes += 1;
              scores[s] = { track: track.add(name), score, votes };
            }
          }
          add("choice1", 5);
          add("choice2", 4);
          add("choice3", 3);
          add("choice4", 2);
          add("choice5", 1);
        });
        const sorted = [];
        Object.entries(scores)
          .sort(
            ([, a], [, b]) =>
              b.score * 1000 - b.votes - (a.score * 1000 - a.votes)
          )
          .forEach(([_, value]) =>
            sorted.push({
              track: Array.from(value.track.keys()),
              score: value.score,
              votes: value.votes,
            })
          );

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
