import React from "react";

import { useRouter } from "next/router";

import Choices from "../components/choices";
import Layout from "../components/layout";
import Results from "../components/results";

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
