import { useRouter } from "next/router";

import Layout from "../components/layout";
import Masters from "../components/masters";
import Choices from "../components/choices";

export default function Home() {
  const router = useRouter();

  const { query } = router.query;

  return (
    <Layout>
      <Choices />
      <Masters search={query.toString()} />
    </Layout>
  );
}
