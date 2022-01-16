import { supabase } from "../lib/supabase";
import * as React from 'react'
import { useRouter } from "next/router";


export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
    };
  }
  /* if user is present, do something with the user data here */
  return { props: { user }, redirect: { destination: '/user/dashboard', permanent: false } };
}

export default function Index(props) {
  const emailRef = React.useRef<HTMLInputElement>()
  const router = useRouter()

  const handleLogin = async (input) => {
    let { user, error } = await supabase.auth.signIn({
      email: input.current.value,
    });
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <h1 className="text-5xl font-black text-center">
        Welcome to Nifty Tickets
      </h1>

      <h2 className="text-center">login page</h2>
      <form>
        <input
          className="text-black"
          type="text"
          ref={emailRef}
          placeholder="youremailhere@gmail.com"
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(emailRef);
          }}
          type="submit"
        >
          login here
        </button>
        <pre>{JSON.stringify(props)}</pre>
      </form>
    </main>
  );
}
