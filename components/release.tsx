import Link from "next/link";
import { StylesProvider } from "@material-ui/core/styles";
import styles from "./release.module.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
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
  const [{ data, fetching, error }] = useReleaseQuery({
    variables: { id: release_id },
  });
  const [choices] = useChoicesQuery();

  const [, updateChoices] = useUpdateChoicesMutation();

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  let update_error;
  const onChooseTrack = async (track) => {
    let existing = choices.data.choices;
    console.log(existing);

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
    const { error, data } = await updateChoices(edited);
    if (error) {
      update_error = error.message;
    }
  };

  const labels = [
    ...Array.from(
      new Set(data?.release.labels.map((l) => `${l.name} (${l.catno})`))
    ),
  ]
    .sort()
    .join(", ");

  const artists = data?.release.artists.map((a) => a.name).join(", ");

  return (
    <StylesProvider injectFirst>
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
            <Table
              className={styles.table}
              size="small"
              aria-label="simple table"
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
                      onChooseTrack(
                        `${artists} – ${data?.release.title} (${track.title})`
                      )
                    }
                    className={track.type_ === "track" ? styles.track : ""}
                  >
                    <TableCell>{track.position}</TableCell>
                    <TableCell>{track.title}</TableCell>
                    <TableCell>{track.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {update_error && <div>{update_error}</div>}
    </StylesProvider>
  );
};

export default Release;
