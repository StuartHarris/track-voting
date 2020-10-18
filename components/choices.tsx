import { StylesProvider } from "@material-ui/core/styles";
import { Delete, ArrowUpward, ArrowDownward } from "@material-ui/icons";

import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import styles from "./choices.module.css";

import {
  useChoicesQuery,
  useUpdateChoicesMutation,
} from "../generated/graphql";

const Choices: React.FC = () => {
  const [{ data, fetching, error }] = useChoicesQuery();
  const [, updateChoices] = useUpdateChoicesMutation();

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  const rows = [
    { num: 1, track: data?.choices?.choice1 },
    { num: 2, track: data?.choices?.choice2 },
    { num: 3, track: data?.choices?.choice3 },
    { num: 4, track: data?.choices?.choice4 },
    { num: 5, track: data?.choices?.choice5 },
  ];
  let update_error = "";
  const onDelete = async (num) => {
    let existing = data.choices;
    let edited = { ...existing };
    edited[`choice${num}`] = "";
    const { error } = await updateChoices(edited);
    if (error) {
      update_error = error.message;
    }
  };

  return (
    <StylesProvider injectFirst>
      <TableContainer component={Paper} className={styles.root}>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan={2} width="100">
                Choice
              </TableCell>
              <TableCell align="left">Track</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((choice, i) => (
              <TableRow key={i} className={styles.choice}>
                <TableCell width="150">
                  <IconButton size="small" onClick={() => onDelete(choice.num)}>
                    <Delete color="action" />
                  </IconButton>
                  <IconButton size="small">
                    <ArrowDownward color="action" />
                  </IconButton>
                  <IconButton size="small">
                    <ArrowUpward color="action" />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  {choice.num}
                </TableCell>
                <TableCell align="left">{choice.track}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {update_error && <div>{update_error}</div>}
    </StylesProvider>
  );
};

export default Choices;
