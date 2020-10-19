import { useRouter } from "next/router";

import Layout from "../components/layout";
import SearchForm, { FormData } from "../components/search_form";

export default function Home() {
  const router = useRouter();

  const onSubmit = ({ query }: FormData) => {
    router.push({
      pathname: "/search",
      query: { query },
    });
  };

  return (
    <Layout>
      <SearchForm onSubmit={onSubmit} />
    </Layout>
  );
}
