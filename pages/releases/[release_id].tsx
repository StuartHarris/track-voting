import { useRouter } from "next/router";

import Layout from "../../components/layout";
import Release from "../../components/release";

export default function Home() {
  const router = useRouter();

  const { release_id } = router.query;

  return (
    <Layout>
      <Release release_id={release_id.toString()} />
    </Layout>
  );
}
