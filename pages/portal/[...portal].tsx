import { supabase } from "../../lib/supabase"
import Link from "next/link"
import Image from "next/image"
import * as React from 'react'
import axios from "axios"
import { useRouter } from "next/router"

export async function getServerSideProps({ req }) {

    const url = req.url.replace('/portal/', "")
    const { data, error } = await supabase.from('posts').select().match({ title: url })

    //valid portal
    if (data.length < 1) return { props: {}, redirect: { destination: '/404', permanent: false } }

    return {
        props: { url: url, data: data }
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
        <main className="min-h-screen bg-slate-900 text-white py-12 lg:py-24">
            <h1 className="text-5xl font-black text-center uppercase tracking-tighter">
                {props.url.replace('-', " ")}
            </h1>
            <img className="mx-auto rounded-2xl my-4 h-64" src="https://lh3.googleusercontent.com/5tgAxROfPXrTYaeluczFaiu3kM43SFAI9AnesPE64fGMZw4Qxz1p1B-rqRvVzi-DPI0xD33pEcfqHMG0e4VQ1rrNC1uCgXV2gK9-=w600"></img>
            <div className="grid grid-cols-1 mx-auto lg:w-1/2 gap-6">
                <h1 className="text-2xl font-black text-left uppercase tracking-tighter">
                    Tickets({props.data[0].max_tickets})
                </h1>
                <div className="flex items-center space-x-4 ">
                    <form onSubmit={() => {
                        handleVerify()
                    }}>
                        <input ref={ticketRef} required={true} type="number" className="text-white rounded-xl  p-4 bg-slate-700" placeholder="enter ticket id" />
                        <button type="submit"

                            className="bg-green-500 text-white p-4 rounded-xl text-2xl font-bold"

                        >
                            verify
                        </button></form></div>



            </div>
        </main>)
}
