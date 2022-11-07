import { getMarkdown } from "../lib/markdown";

import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Members({ markdown }) {
  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    return router.push("/");
  }

  if (!session.user.isSubscriber) {
    return router.push("/join");
  }

  return (
    <div>
      <Head>
        <title>Private Area</title>
        <meta name="description" content="Private Area" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center ">
        <h1 className=" mt-20 text-2xl font-extrabold">Private Area</h1>

        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: markdown }}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const markdown = await getMarkdown();

  return {
    props: {
      markdown,
    },
  };
}
