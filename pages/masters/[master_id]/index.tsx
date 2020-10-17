import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "../../../components/layout";
import Choices from "../../../components/choices";
import Versions from "../../../components/versions";

export default function Home() {
  const router = useRouter();

  const { master_id } = router.query;

  return (
    <Layout>
      <Choices />
      <Versions master_id={master_id.toString()} />
      <Link href="/" passHref scroll={false}>
        <a>home</a>
      </Link>
    </Layout>
  );
}
