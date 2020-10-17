import { useRouter } from "next/router";

import Layout from "../components/layout";
import SearchForm from "../components/search_form";
import Choices from "../components/choices";

export default function Home() {
  const router = useRouter();

  const onSubmit = ({ search: query }) =>
    router.push({
      pathname: "/search",
      query: { query },
    });

  return (
    <Layout>
      <Choices />
      <SearchForm onSubmit={onSubmit} />
    </Layout>
  );
}
