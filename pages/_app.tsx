import React from "react";
import { withUrqlClient, NextUrqlAppContext } from "next-urql";
import NextApp, { AppProps } from "next/app";
import fetch from "isomorphic-unfetch";
import { Container, CssBaseline } from "@material-ui/core";

import "../styles/globals.css";

const GRAPHQL_ENDPOINT = `/api/graphql`;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Component {...pageProps} />
      </Container>
    </>
  );
};

App.getInitialProps = async (ctx: NextUrqlAppContext) => {
  const appProps = await NextApp.getInitialProps(ctx);
  return { ...appProps };
};

export default withUrqlClient((_ssrExchange, _ctx) => ({
  url: GRAPHQL_ENDPOINT,
  fetch,
}))(
  // @ts-ignore
  App
);
