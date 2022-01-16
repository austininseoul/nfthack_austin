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
  return { props: { user: user }, redirect: { destination: '/user/dashboard', permanent: false } };
}

export default function Index(props) {
  console.log(props);
  const emailRef = React.useRef<HTMLInputElement>()
  const router = useRouter()

  const handleLogin = async (input) => {
    let { user, error } = await supabase.auth.signIn({
      email: input.current.value,
    });
    if (user) alert('email sent!')
  };

  return (
    <main className="min-h-screen  flex justify-center items-center">
      <div className="grid grid-cols-1 gap-6">
        <span className="text-black font-black text-4xl">🎨NFTPortal</span>
        <p className="text-xl text-center ">enter email</p>
        <input required={true} className="text-zinc-600 rounded-xl p-2 my-2 bg-zinc-300" ref={emailRef} placeholder="email address" />
        <button
          className="bg-indigo-500 text-white p-4 rounded-xl text-2xl font-bold"
          onClick={() => handleLogin(emailRef)}
        >
          sign up
        </button>
      </div>
    </main>
  );
}
