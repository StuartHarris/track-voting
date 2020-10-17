import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "./choices.module.css";

import { useChoicesQuery } from "../generated/graphql";

const Choices: React.FC = () => {
  const [{ data, fetching, error }] = useChoicesQuery();

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  const rows = [
    { choice: 1, track: data?.choices?.choice1 },
    { choice: 2, track: data?.choices?.choice2 },
    { choice: 3, track: data?.choices?.choice3 },
    { choice: 4, track: data?.choices?.choice4 },
    { choice: 5, track: data?.choices?.choice5 },
  ];
  return (
    <StylesProvider injectFirst>
      <TableContainer component={Paper}>
        <Table className={styles.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Choice</TableCell>
              <TableCell align="left">Track</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" align="right">
                  {row.choice}
                </TableCell>
                <TableCell align="left">{row.track}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>{" "}
    </StylesProvider>
  );
};

export default Choices;
