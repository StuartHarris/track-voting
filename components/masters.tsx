import Link from "next/link";

import withWidth, {
  isWidthUp,
  WithWidthProps,
} from "@material-ui/core/withWidth";
import { StylesProvider } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/MenuOutlined";
import styles from "./masters.module.css";

import { useSearchQueryQuery } from "../generated/graphql";

interface Props extends WithWidthProps {
  search: string;
}

const Masters: React.FC<Props> = ({ search, width }) => {
  const [{ data, fetching, error }] = useSearchQueryQuery({
    variables: { search },
    pause: !search,
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
    <StylesProvider injectFirst>
      <div className={styles.root}>
        <GridList
          cellHeight="auto"
          cols={getGridListCols()}
          className={styles.gridlist}
        >
          {data?.masters.map((tile) => (
            <GridListTile key={tile.id}>
              <Link href={`/masters/${tile.id}`}>
                <a>
                  <img src={tile.cover_image} alt={tile.title} />
                  <GridListTileBar
                    title={tile.title}
                    subtitle={
                      <span>
                        {tile.year} ({tile.country})
                      </span>
                    }
                    actionIcon={
                      <IconButton aria-label={`info about ${tile.title}`}>
                        <MenuIcon className={styles.icon} />
                      </IconButton>
                    }
                  />
                </a>
              </Link>
            </GridListTile>
          ))}
        </GridList>
      </div>
    </StylesProvider>
  );
};

export default withWidth()(Masters);
