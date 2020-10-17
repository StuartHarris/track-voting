import Link from "next/link";
import { StylesProvider } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import styles from "./versions.module.css";

import { useVersionsQuery } from "../generated/graphql";

interface Props {
  master_id: string;
}

const Versions: React.FC<Props> = ({ master_id }) => {
  const [{ data, fetching, error }] = useVersionsQuery({
    variables: { master_id },
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
              <TableCell>Title</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Released</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.versions.map((row, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Link
                    href={`/masters/${master_id}/versions/${row.id}`}
                    passHref
                  >
                    <a>{row.title}</a>
                  </Link>
                </TableCell>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.released}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StylesProvider>
  );
};

export default Versions;
