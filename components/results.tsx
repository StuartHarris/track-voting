import Link from "next/link";

import withWidth, {
  isWidthUp,
  WithWidthProps,
} from "@material-ui/core/withWidth";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { Typography } from "@material-ui/core";

import styles from "./results.module.css";

import { useSearchQuery } from "../generated/graphql";

interface Props extends WithWidthProps {
  query: string;
}

const Results: React.FC<Props> = ({ query, width }) => {
  const [{ data, fetching, error }] = useSearchQuery({
    variables: { query },
    pause: !query,
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const getGridListCols = () => {
    if (isWidthUp("xl", width)) {
      return 4;
    }

    if (isWidthUp("lg", width)) {
      return 3;
    }

    if (isWidthUp("md", width)) {
      return 2;
    }

    return 1;
  };

  return (
    <div className={styles.root}>
      <GridList
        cellHeight="auto"
        cols={getGridListCols()}
        className={styles.gridlist}
        spacing={30}
      >
        {data?.search.map((tile) => (
          <GridListTile key={tile.id}>
            <Link href={`/releases/${tile.id}`}>
              <a>
                <img
                  className={styles.center_cropped}
                  src={tile.cover_image}
                  alt={tile.title}
                />
                <GridListTileBar
                  title={tile.title}
                  className={styles.bar}
                  subtitle={
                    <>
                      <div>
                        {[...Array.from(new Set(tile.label))].sort().join(", ")}
                      </div>
                      <div>
                        {tile.year} ({tile.country})
                      </div>
                    </>
                  }
                />
              </a>
            </Link>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
};

export default withWidth()(Results);
