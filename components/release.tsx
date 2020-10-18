import Link from "next/link";
import { StylesProvider } from "@material-ui/core/styles";
import styles from "./release.module.css";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import { useReleaseQuery } from "../generated/graphql";

interface Props {
  release_id: string;
}

const Release: React.FC<Props> = ({ release_id }) => {
  const [{ data, fetching, error }] = useReleaseQuery({
    variables: { id: release_id },
  });

  if (fetching) return <p>Loading...</p>;
  if (error) {
    return <p>Oh no... {error.message}</p>;
  }

  return (
    <StylesProvider injectFirst>
      <Card className={styles.root}>
        <CardHeader
          title={data?.release.title}
          subheader={data?.release.artists.map((a) => a.name).join(", ")}
        />{" "}
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
            {[
              ...Array.from(
                new Set(
                  data?.release.labels.map((l) => `${l.name} (${l.catno})`)
                )
              ),
            ]
              .sort()
              .join(", ")}
          </Typography>
          <Typography className={styles.pos} color="textSecondary">
            {data?.release.released}
          </Typography>
          <Typography variant="body2" component="p">
            {data?.release.notes}
          </Typography>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table className={styles.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Position</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.release.tracklist.map((track, i) => (
              <TableRow key={i}>
                <TableCell>{track.position}</TableCell>
                <TableCell>
                  <Link href={`/`} passHref>
                    <a>{track.title}</a>
                  </Link>
                </TableCell>
                <TableCell>{track.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StylesProvider>
  );
};

export default Release;
