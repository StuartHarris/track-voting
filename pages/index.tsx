import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../components/layout";
import { Masters } from "../components/masters";

type FormData = {
  example: string;
  exampleRequired: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);
export default function Home() {
  const { register, handleSubmit } = useForm<FormData>();
  const [query, setQuery] = useState("");
  const classes = useStyles();

  const onSubmit = ({ search }) => setQuery(search);

  return (
    <Layout>
      <section>
        <form className={classes.root} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h2">Find a track</Typography>
          <TextField
            inputRef={register}
            name="search"
            label="search..."
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Find tracks&nbsp;
            <Search />
          </Button>
        </form>
      </section>
      <Masters search={query} />
    </Layout>
  );
}
