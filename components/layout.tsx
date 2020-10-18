import { Typography } from "@material-ui/core";
import Head from "next/head";
import Link from "next/link";
import { StylesProvider } from "@material-ui/core/styles";
import Choices from "../components/choices";

import styles from "./layout.module.css";

export const siteTitle = "Track Voting";

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div>
      <Head>
        <title>Track Voting</title>
        <meta name="description" content="Vote for your top tracks" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <StylesProvider injectFirst>
        <main>
          <Link href="/" passHref scroll={false}>
            <a>
              <img src="/images/Trade30th.png" height="200px"></img>
            </a>
          </Link>
          <Choices />
          {children}
        </main>
        <footer className={styles.footer}>
          <hr />
          <Typography variant="body2">
            This application uses Discogs’ API but is not affiliated with,
            sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink
            Media, LLC.
          </Typography>
        </footer>
      </StylesProvider>
    </div>
  );
}
