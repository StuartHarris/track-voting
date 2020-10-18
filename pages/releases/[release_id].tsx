import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "../../components/layout";
import Choices from "../../components/choices";
import Tracks from "../../components/tracks";

export default function Home() {
  const router = useRouter();

  const { release_id } = router.query;

  return (
    <Layout>
      <Choices />
      <Tracks release_id={release_id.toString()} />
      <Link href="/" passHref scroll={false}>
        <a>home</a>
      </Link>
    </Layout>
  );
}
