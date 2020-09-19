import { Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";

import Layout from "../components/layout";
import { useSearchQueryQuery } from "../generated/graphql";

type FormData = {
  example: string;
  exampleRequired: string;
};

const Masters: React.FC = () => {
  const [{ data, fetching, error }, executeQuery] = useSearchQueryQuery({
    variables: { search: "Let's Rock" },
  });
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      {data?.masters.map((master, i) => (
        <div key={i}>{master.title}</div>
      ))}
    </div>
  );
};

export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = ({ search }) => {
    console.log(search);
    // executeQuery(search);
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
      <Masters />
    </Layout>
  );
}
