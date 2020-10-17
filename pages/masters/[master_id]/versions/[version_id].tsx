import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "../../../../components/layout";
import Choices from "../../../../components/choices";
import Tracks from "../../../../components/tracks";

export default function Home() {
  const router = useRouter();

  const { version_id } = router.query;

  return (
    <Layout>
      <Choices />
      <Tracks version_id={version_id.toString()} />
      <Link href="/" passHref scroll={false}>
        <a>home</a>
      </Link>
    </Layout>
  );
}

// http://localhost:3000/masters/155893/versions/582312
