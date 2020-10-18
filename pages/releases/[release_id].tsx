import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "../../components/layout";
import Choices from "../../components/choices";
import Release from "../../components/release";

export default function Home() {
  const router = useRouter();

  const { release_id } = router.query;

  return (
    <Layout>
      <Choices />
      <Release release_id={release_id.toString()} />
      <hr />
      <Link href="/" passHref scroll={false}>
        <a>Choose another track</a>
      </Link>
    </Layout>
  );
}
