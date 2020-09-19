import { StylesProvider } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/MenuOutlined";
import styles from "./masters.module.css";

import { useSearchQueryQuery } from "../generated/graphql";

export function Masters({ search }: { search: string }) {
  const [{ data, fetching, error }] = useSearchQueryQuery({
    variables: { search },
    pause: !search,
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <StylesProvider injectFirst>
      <div className={styles.root}>
        <GridList cellHeight={300} className={styles.gridlist}>
          {data?.masters.map((tile) => (
            <GridListTile key={tile.id}>
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
            </GridListTile>
          ))}
        </GridList>
      </div>
    </StylesProvider>
  );
}
