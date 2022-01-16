import Head from "next/head";
import { Form } from "../../../components/Form";
import { useMoralis } from "react-moralis";
import * as React from "react";

export async function getServerSideProps({ req }) {
  var jwt = require("jsonwebtoken");

  const key = process.env.NEXT_PUBLIC_JWT_SIGNER;

  const url = req.url.replace("/portal/auth/", "");

  const token = jwt.verify(url, key, (err, decoded) => {
    return decoded;
  });

  return { props: { token: token } };
}

export default function Home(props) {
  const { user, isAuthenticated, authenticate, logout, Moralis } = useMoralis();

  //spoof address
  //const owner_address = "0xe41a6d406fc97ac53b9e34489fe791a821064ea0";

  const owner_address = user ? user.attributes.ethAddress : "";

  if (user) {
    return (
      <div>
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="min-h-screen bg-slate-900 text-white">
          <h1 className="text-5xl font-black text-center">
            Welcome to Nifty Tickets
          </h1>
          <br></br>
          {user && <Form address={owner_address} props={props} />}
        </main>
      </div>
    );
  } else {
    return (
      <>
        <main className="min-h-screen bg-slate-900 text-white">
          <button
            className="bg-green-500 text-white p-4 rounded-xl text-2xl font-bold"
            onClick={() => authenticate()}
          >
            auth
          </button>
          <button
            className="bg-blue-500 text-white p-4 rounded-xl text-2xl font-bold"
            onClick={() => {
              logout();
              alert("logging out!");
            }}
          >
            logout
          </button>
        </main>
      </>
    );
  }
}