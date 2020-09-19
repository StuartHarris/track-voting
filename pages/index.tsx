import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Button, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../components/layout";
import { useSearchQueryQuery } from "../generated/graphql";

type FormData = {
  example: string;
  exampleRequired: string;
};

const useStyles = makeStyles({
  table: {
    // minWidth: 650,
  },
});

const Masters = ({ search }: { search: string }) => {
  const [{ data, fetching, error }] = useSearchQueryQuery({
    variables: { search },
    pause: !search,
  });
  const classes = useStyles();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Cover</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Year</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.masters.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <img src={row.thumb} />
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell align="right">{`${row.year} (${row.country})`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
