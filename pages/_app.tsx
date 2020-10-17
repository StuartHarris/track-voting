import React from "react";
import { withUrqlClient, NextUrqlAppContext } from "next-urql";
import NextApp, { AppProps } from "next/app";
import fetch from "isomorphic-unfetch";
import { Container, CssBaseline } from "@material-ui/core";
import Cookies from "cookies";
import { v4 as uuidV4 } from "uuid";

import "../styles/globals.css";

const GRAPHQL_ENDPOINT = `/api/graphql`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl">
        <Component {...pageProps} />
      </Container>
    </>
  );
};

App.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx);
  return { ...appProps };
};

export default withUrqlClient((_ssrExchange, ctx) => {
  if (ctx && ctx.req && ctx.res) {
    const cookie = new Cookies(ctx.req, ctx.res);
    // @ts-ignore
    let token = cookie.get("token");
    if (!token) {
      token = uuidV4();
      cookie.set("token", token);
    }
  }

  return {
    url: GRAPHQL_ENDPOINT,
    fetch,
    fetchOptions: {
      headers: {
        Authorization: "stu",
      },
    },
  };
})(
  // @ts-ignore
  App
);
