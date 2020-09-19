import { useState } from "react";

import Layout from "../components/layout";
import SearchForm from "../components/search_form";
import { Masters } from "../components/masters";

export default function Home() {
  const [query, setQuery] = useState("");

  const onSubmit = ({ search }) => setQuery(search);

  return (
    <Layout>
      <SearchForm onSubmit={onSubmit} />
      <Masters search={query} />
    </Layout>
  );
}
