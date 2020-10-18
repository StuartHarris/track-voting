import { useRouter } from "next/router";

import Layout from "../components/layout";
import Releases from "../components/releases";
import Choices from "../components/choices";

export default function Home() {
  const router = useRouter();

  const { query } = router.query;

  return (
    <Layout>
      <Choices />
      <Releases query={query.toString()} />
    </Layout>
  );
}
