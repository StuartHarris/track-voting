import { useRouter } from "next/router";

import Layout from "../components/layout";
import Results from "../components/results";

export default function Home() {
  const router = useRouter();

  const { query } = router.query;

  return (
    <Layout>
      <Results query={query.toString()} />
    </Layout>
  );
}
