import Head from "next/head";
import Link from "next/link";

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
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Vote for your top tracks" />
      </Head>
      <main>{children}</main>
    </div>
  );
}
