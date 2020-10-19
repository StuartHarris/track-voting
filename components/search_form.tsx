import { Container, Button, TextField, Typography } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { Search } from "@material-ui/icons";

import styles from "./search_form.module.css";

export type FormData = {
  query: string;
};

interface Props {
  onSubmit: (d: FormData) => void;
}

const SearchForm: React.FC<Props> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<FormData>();

  return (
    <Container>
      <form className={styles.root} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4">Find a track ...</Typography>
        <TextField
          inputRef={register}
          name="query"
          id="query"
          label="search"
          variant="filled"
        />
        <Button type="submit" variant="contained" color="primary">
          Find tracks&nbsp;
          <Search />
        </Button>
      </form>
    </Container>
  );
};

export default SearchForm;
