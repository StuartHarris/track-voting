import { Button, TextField } from "@material-ui/core";
import { createClient, useQuery, Provider } from "urql";
import { useForm } from "react-hook-form";

import Layout from "../components/layout";

const API = "http://localhost:3000/api/graphql";
const client = createClient({ url: API });

type FormData = {
  example: string;
  exampleRequired: string;
};

const SearchQuery = `
  query($search: String!) {
    masters(search: $search) { title }
  }
`;

const Masters = ({ search }) => {
  const [result] = useQuery({
    query: SearchQuery,
    variables: { search },
    pause: !search,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      {data &&
        data.masters.map((master, i) => <div key={i}>{master.title}</div>)}
    </div>
  );
};

export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();

  const search = "";
  const onSubmit = ({ search }) => {
    console.log(search);
    search = search;
  };

  return (
    <Layout>
      <section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField inputRef={register} name="search" />
          <Button type="submit" color="primary">
            Go!
          </Button>
        </form>
      </section>
      <Provider value={client}>
        <Masters search={search} />
      </Provider>
    </Layout>
  );
}
