import { StylesProvider } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Search } from "@material-ui/icons";

import styles from "./search_form.module.css";

type FormData = {
  example: string;
  exampleRequired: string;
};

export default function ({ onSubmit }) {
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <StylesProvider injectFirst>
      <form className={styles.root} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Find a track ...</Typography>
        <TextField
          inputRef={register}
          name="search"
          label="search..."
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Find tracks&nbsp;
          <Search />
        </Button>
      </form>
      <hr />
    </StylesProvider>
  );
}
