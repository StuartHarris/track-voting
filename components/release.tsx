import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./release.module.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
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

import {
  useChoicesQuery,
  useReleaseQuery,
  useUpdateChoicesMutation,
} from "../generated/graphql";

interface Props {
  release_id: string;
}

const Release: React.FC<Props> = ({ release_id }) => {
  const router = useRouter();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [{ data, fetching, error }] = useReleaseQuery({
    variables: { id: release_id },
  });
  const [choices] = useChoicesQuery();

  const [, updateChoices] = useUpdateChoicesMutation();

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  const onChooseTrack = async (track) => {
    let existing = choices.data.choices;
    let edited = {};
    let chosen = false;
    for (let key in existing) {
      let value = existing[key];
      if (!chosen && !value) {
        value = track;
        chosen = true;
      }
      edited[key] = value;
    }
    if (!chosen) {
      setUpdateError("You have already chosen 5 tracks. Delete one first.");
      return;
    }
    const { error } = await updateChoices(edited);
    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(true);
      setTimeout(() => {
        router.push({ pathname: "/" });
      }, 2000);
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

  const labels = [
    ...Array.from(
      new Set(data?.release.labels.map((l) => `${l.name} (${l.catno})`))
    ),
  ]
    .sort()
    .join(", ");

  const artists = data?.release.artists.map((a) => a.name).join(", ");

  return (
    <Grid container spacing={3} className={styles.root}>
      <Grid item sm={12} md={3}>
        <Card className={styles.card}>
          <CardHeader title={data?.release.title} subheader={artists} />{" "}
          <CardMedia
            className={styles.media}
            image={data?.release.images[0].resource_url}
            title={data?.release.title}
          />
          <CardContent>
            <Typography
              className={styles.title}
              color="textSecondary"
              gutterBottom
            >
              {labels}
            </Typography>
            <Typography className={styles.pos} color="textSecondary">
              {data?.release.released}
            </Typography>
            <Typography variant="body2" component="p">
              {data?.release.notes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sm={12} md={9}>
        <TableContainer component={Paper} className={styles.tracks}>
          <Typography variant="h4">Choose a track ...</Typography>
          <Table
            className={styles.table}
            size="small"
            aria-label="simple table"
            title="Select a track"
          >
            <TableHead>
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.release.tracklist.map((track, i) => (
                <TableRow
                  key={i}
                  onClick={() =>
                    track.type_ === "track" &&
                    onChooseTrack(`${artists} – ${track.title}`)
                  }
                  className={
                    track.type_ === "track" ? styles.track : styles.side
                  }
                >
                  <TableCell>{track.position}</TableCell>
                  <TableCell>{track.title}</TableCell>
                  <TableCell>{track.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>{" "}
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
      </Grid>
    </Grid>
  );
};

export default Release;
