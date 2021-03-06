import { useState } from "react";
import { Delete, ArrowUpward, ArrowDownward } from "@material-ui/icons";

import IconButton from "@material-ui/core/IconButton";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import styles from "./choices.module.css";

import {
  useChoicesQuery,
  useUpdateChoicesMutation,
} from "../generated/graphql";

const Choices: React.FC = () => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [{ data, fetching, error }] = useChoicesQuery();
  const [, updateChoices] = useUpdateChoicesMutation();

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  const onDelete = async (num) => {
    let existing = data.choices;
    let edited = { ...existing };
    edited[`choice${num}`] = "";
    const { error } = await updateChoices(edited);
    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(true);
    }
  };

  const onMoveDown = async (num) => {
    let existing = data.choices;
    let edited = { ...existing };
    let current = edited[`choice${num}`];
    let next = edited[`choice${num + 1}`];
    edited[`choice${num}`] = next;
    edited[`choice${num + 1}`] = current;
    const { error } = await updateChoices(edited);
    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(true);
    }
  };

  const onMoveUp = async (num) => {
    let existing = data.choices;
    let edited = { ...existing };
    let current = edited[`choice${num}`];
    let next = edited[`choice${num - 1}`];
    edited[`choice${num}`] = next;
    edited[`choice${num - 1}`] = current;
    const { error } = await updateChoices(edited);
    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateSuccess(false);
    setUpdateError("");
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const has_five =
    data?.choices?.choice1 &&
    data?.choices?.choice2 &&
    data?.choices?.choice3 &&
    data?.choices?.choice4 &&
    data?.choices?.choice5;

  return (
    <>
      <TableContainer component={Paper} className={styles.table}>
        <Typography variant="h4">Your top 5 Trade tracks ...</Typography>
        <Table size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" width="100">
                Choice
              </TableCell>
              <TableCell align="left" colSpan={4}>
                Track
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array(5)
              .fill(1)
              .map((_, i) => (
                <TableRow key={i} className={styles.choice}>
                  <TableCell component="th" scope="row" align="right">
                    {i + 1}
                  </TableCell>
                  <TableCell align="left" className={styles.track}>
                    {data?.choices[`choice${i + 1}`]}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => onDelete(i + 1)}>
                      <Delete color="action" />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {i < 4 && (
                      <IconButton
                        size="small"
                        onClick={() => onMoveDown(i + 1)}
                      >
                        <ArrowDownward color="action" />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    {i !== 0 && (
                      <IconButton size="small" onClick={() => onMoveUp(i + 1)}>
                        <ArrowUpward color="action" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={updateError !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error">
          {updateError}
        </Alert>
      </Snackbar>
      <Snackbar
        open={updateSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Your vote has been saved!
        </Alert>
      </Snackbar>
      {has_five && (
        <Typography variant="h5">
          <p>Thank you for voting! Your Trade Top 5 has been registered!</p>
        </Typography>
      )}
    </>
  );
};

export default Choices;
