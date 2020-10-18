import { useRouter } from "next/router";

import Layout from "../components/layout";
import Results from "../components/results";
import Choices from "../components/choices";

export default function Home() {
  const router = useRouter();

  const { query } = router.query;

  return (
    <Layout>
      <Choices />
      <Results query={query.toString()} />
    </Layout>
  );
}
