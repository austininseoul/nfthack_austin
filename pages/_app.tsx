import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { supabase } from "../lib/supabase";
import * as React from "react";
import { useRouter } from "next/router";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] = React.useState<boolean>(false);


  React.useEffect(() => {
    /* fires when a user signs in or out */
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
        if (event === "SIGNED_IN") {
          setAuthenticatedState(true);
          router.push("/user/dashboard");
        }
        if (event === "SIGNED_OUT") {
          setAuthenticatedState(false);
        }
      }
    );
    checkUser();
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  async function checkUser() {
    /* when the component loads, checks user to show or hide Sign In link */
    const user = await supabase.auth.user();
    if (user) {
      setAuthenticatedState(true);
    }
  }
  async function handleAuthChange(event, session) {
    /* sets and removes the Supabase cookie */
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }

  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default App;
