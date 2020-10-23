import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import Layout from "../components/layout";
import { useTopQuery } from "../generated/graphql";
import styles from "./top.module.css";

export default function Home() {
  const [{ data, fetching, error }] = useTopQuery();

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <Layout>
      <TableContainer component={Paper}>
        <Typography variant="h4">Top Trade tracks</Typography>
        <Typography variant="h5">{data?.top.count} votes registered</Typography>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" width="100"></TableCell>
              <TableCell align="left" width="100" className={styles.track}>
                Track
              </TableCell>
              <TableCell align="left" colSpan={4}>
                Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.top?.scores.map(({ title, value }, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="right">
                  {i + 1}
                </TableCell>
                <TableCell align="left" className={styles.track}>
                  {title}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
