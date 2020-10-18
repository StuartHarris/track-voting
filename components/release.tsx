import Link from "next/link";
import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "./choices.module.css";

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
