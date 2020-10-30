import React from "react";
// import { useRouter } from "next/router";

import { Typography } from "@material-ui/core";

import Layout from "../components/layout";
// import Choices from "../components/choices";
// import { FormData } from "../components/search_form";

export default function Home() {
  // const router = useRouter();

  // const onSubmit = ({ query }: FormData) => {
  //   router.push({
  //     pathname: "/search",
  //     query: { query },
  //   });
  // };

  return (
    <Layout>
      {/* <Choices /> */}
      {/* <SearchForm onSubmit={onSubmit} /> */}
      <Typography variant="h4">
        Voting for the Trade Top 30 has now closed
      </Typography>
    </Layout>
  );
}
