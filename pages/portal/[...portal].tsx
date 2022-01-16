import { supabase } from "../../lib/supabase"
import Link from "next/link"
import Image from "next/image"
import * as React from 'react'
import axios from "axios"
import { useRouter } from "next/router"
import { Navbar } from "../../components/Navbar"

export async function getServerSideProps({ req }) {

    const { user } = await supabase.auth.api.getUserByCookie(req);

    const url = req.url.replace('/portal/', "")
    const { data, error } = await supabase.from('posts').select().match({ title: url })

    //valid portal
    if (data.length < 1) return { props: {}, redirect: { destination: '/404', permanent: false } }

    return {
        props: { url: url, data: data, user: user }
    }
}



export default function Portal(props) {

    const event_address = props.data[0].address
    const ticketRef = React.useRef<HTMLInputElement>()
    const router = useRouter()

    const handleVerify = async () => {

        const data = await axios({
            method: 'POST', url: '/api/jwt', data: { address: event_address, ticket_id: ticketRef.current.value }
        })

        router.push(`/portal/auth/${data.data.token}`)
    }

    return (
        <>
            {props.user && <Navbar props={props} href={""} />}
            <main className="min-h-screen py-24">
                <h1 className="text-5xl font-black text-center uppercase tracking-tighter">
                    {props.url.replace('-', " ")}
                </h1>
                <img className="mx-auto rounded-2xl my-4 h-64" src="https://lh3.googleusercontent.com/5tgAxROfPXrTYaeluczFaiu3kM43SFAI9AnesPE64fGMZw4Qxz1p1B-rqRvVzi-DPI0xD33pEcfqHMG0e4VQ1rrNC1uCgXV2gK9-=w600"></img>
                <div className="container flex justify-center">
                    <div className="w-2/3 grid grid-cols-1 lg:w-1/2 gap-6">
                        <h1 className="text-2xl font-black text-left uppercase tracking-tighter">
                            Tickets({props.data[0].max_tickets})
                        </h1>

                        <form
                            className="grid grid-cols-1 gap-6"
                            onSubmit={() => {
                                handleVerify()
                            }}>
                            enter ticket id below:
                            <input ref={ticketRef} required={true} type="number" className="text-zinc-600 rounded-xl p-2 my-2 h-full bg-zinc-300" placeholder="enter ticket id" />
                            <button type="submit"

                                className="bg-indigo-500 text-white p-4 rounded-xl text-xl font-bold"

                            >
                                verify
                            </button>
                        </form>



                    </div>
                </div>
            </main>
        </>
    )
}
