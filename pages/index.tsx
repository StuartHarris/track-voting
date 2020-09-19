import { Button, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../components/layout";
import { useSearchQueryQuery } from "../generated/graphql";

type FormData = {
  example: string;
  exampleRequired: string;
};

const Masters = ({ search }: { search: string }) => {
  const [{ data, fetching, error }] = useSearchQueryQuery({
    variables: { search },
    pause: !search,
  });
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>thumb</th>
          <th>title</th>
        </tr>
      </thead>
      <tbody>
        {data?.masters.map((master, i) => (
          <tr key={i}>
            <td>
              <img src={master.thumb} />
            </td>
            <td>{master.title}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();
  const [query, setQuery] = useState("");

  const onSubmit = ({ search }) => setQuery(search);

  return (
    <Layout>
      <section>
        <Typography variant="h2">Find a track</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField inputRef={register} name="search" />
          <Button type="submit" variant="contained" color="primary">
            Go!
          </Button>
        </form>
      </section>
      <Masters search={query} />
    </Layout>
  );
}
