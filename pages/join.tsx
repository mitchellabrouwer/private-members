import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

export default function Join() {
  const router = useRouter();

  const { data: session, status } = useSession();

  const loading = status === "loading";

  if (loading) {
    return null;
  }

  if (!session) {
    router.push("/");
    return;
  }

  if (session.user.isSubscriber) {
    router.push("/members");
    return;
  }

  return (
    <div>
      <Head>
        <title>Private Area</title>
        <meta name="description" content="Private Area" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script src="https://js.stripe.com/v3/" />

      <div className="text-center ">
        <h1 className=" mt-20 text-2xl font-extrabold">Private Area</h1>

        <p className="mt-10">Join for just $5/m</p>

        <button
          className="mt-10 bg-black px-5 py-2 text-white"
          onClick={async (event) => {
            const res = await fetch("/api/stripe/session", {
              method: "POST",
            });

            const data = await res.json();

            if (data.status === "error") {
              return alert(data.message);
            }
            const sessionId = data.sessionId;
            const stripePublicKey = data.stripePublicKey;
            // @ts-ignore
            const stripe = Stripe(stripePublicKey);
            stripe.redirectToCheckout({ sessionId });
          }}
        >
          Create a subscription
        </button>
      </div>
    </div>
  );
}
