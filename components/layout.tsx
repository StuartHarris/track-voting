import { Typography } from "@material-ui/core";
import Head from "next/head";

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
        {" "}
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
      <main>{children}</main>
      <footer>
        <Typography variant="body2">
          This application uses Discogs’ API but is not affiliated with,
          sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink
          Media, LLC.
        </Typography>
        <style jsx>{`
          margin: 20px;
        `}</style>
      </footer>
    </div>
  );
}
