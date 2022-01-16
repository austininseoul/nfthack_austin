import { supabase } from "../../lib/supabase";
import * as React from 'react'
import { useForm } from "react-hook-form";
import { Event } from '../../types'
import { Navbar } from "../../components/Navbar";
import { useRouter } from "next/router";

export async function getServerSideProps({ req }) {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    if (!user) {
        return {
            props: {}, redirect: { destination: '/', permanent: false }
        };
    } else {
        const { data, error } = await supabase.from('posts').select().match({ user: user.email })
        return { props: { data: data, user: user } };
    }
    /* if user is present, do something with the user data here */

}
/* if user is present, do something with the user data here */



export default function Dashboard(props) {

    const [create, setCreate] = React.useState<boolean>(false)
    const { register, handleSubmit } = useForm()
    const [event, setEvent] = React.useState<Event>()
    const router = useRouter()

    React.useEffect(() => {
        if (props.data.length > 0) {
            setEvent({
                event_name: props.data[0].title,
                event_address: props.data[0].address,
                max_tickets: props.data[0].max_tickets,
                tickets: []
            })
        }
    }, [])

    const onSubmit = async (formData) => {
        alert('submitting...')
        console.log(formData)
        setEvent({
            event_name: formData.event_name,
            event_address: formData.event_address,
            max_tickets: formData.max_tickets,
            tickets: []
        })
        alert('event created!')

        if (event) {
            await supabase.from('posts')
                .update({
                    title: formData.event_name.replace(" ", "-"),
                    address: formData.event_address,
                    max_tickets: formData.max_tickets,
                    user: props.user.email
                })
                .match({ user: props.user.email })
        } else {
            await supabase.from('posts')
                .insert({
                    title: formData.event_name.replace(" ", "-"),
                    address: formData.event_address,
                    max_tickets: formData.max_tickets,
                    user: props.user.email
                })
        }

    }

    const handleDelete = async () => {
        await supabase.from('posts').delete().match({ user: props.user.email })
    }

    return (
        <>
            <Navbar props={props} href={event ? `/portal/${event.event_name}` : ""} />
            <main className="min-h-screen lg:w-1/2 w-3/4 pt-24 mx-auto">

                <h1 className="text-5xl font-black text-center">
                    🎮dashboard
                </h1>
                <div className="container mx-auto grid grid-cols-1 gap-4 py-12">

                    {(props.data.length < 1 && !create) && <><h1 className="text-xl text-left">
                        👋hey, looks like you have no events, create one to get started
                    </h1><button
                        className="bg-green-500 text-white p-4 rounded-xl text-2xl font-bold"
                        onClick={() => {
                            alert('creating event')
                            setCreate(true)

                        }
                        }
                    >
                            create event
                        </button></>}
                    {create && <>
                        <p className="text-xl text-left ">{event ? "update" : "enter"} your event details below</p>
                        <form className="grid grid-cols-1 py-6" onSubmit={handleSubmit(onSubmit)}>

                            <p className="text-xl text-left ">🏆event name</p>
                            <input required={true} className="text-zinc-600 rounded-xl p-2 my-2 bg-zinc-300" {...register("event_name")} placeholder="event name" />
                            <p className="text-xl text-left ">📂event address</p>
                            <input required={true} className="text-zinc-600 rounded-xl p-2 my-2 bg-zinc-300" {...register("event_address")} placeholder="event address" />
                            <p className="text-xl text-left ">🎟max tickets</p>
                            <input required={true} className="text-zinc-600 rounded-xl p-2 my-2 bg-zinc-300"{...register("max_tickets")} placeholder="# of tickets" type="number" />
                            <button type="submit" className="my-6 bg-green-500 text-white p-4 rounded-xl text-2xl font-bold" >{event ? "update" : "create"}</button>
                        </form></>}

                    {event && <>
                        <div className="text-5xl font-bold tracking-tighter flex justify-between items-center text-center uppercase">
                            <p> 📕{event.event_name.replace("-", " ")}</p>
                        </div>
                        <p className="font-mono">event address: <a className="text-indigo-500" href={`https://etherscan.io/address/${event.event_address}`}>{event.event_address}</a></p>

                        <p className="font-mono">by default all items at address are valid tickets</p>
                        <h1 className="text-2xl font-black text-left">
                            link @: <a href={`/portal/${event.event_name}`} className="text-indigo-500">{`/${event.event_name}`}</a>
                        </h1>
                        <div className="grid grid-cols-2 gap-6">
                            <p className="text-xl font-mono text-center">
                                Remaining Tickets: ({event.max_tickets})
                            </p>
                            <p className="text-xl font-mono text-center">
                                Max Tickets: ({event.max_tickets})
                            </p>
                            <button
                                className="bg-indigo-500 text-white p-4 rounded-xl text-2xl font-bold"
                                onClick={() => {

                                    alert("edit");
                                    setCreate(!create)
                                }}
                            >
                                edit

                            </button>
                            <button
                                className="bg-red-500 text-white p-4 rounded-xl text-2xl font-bold"
                                onClick={() => {

                                    alert("are you sure?");
                                    handleDelete()
                                    router.reload()
                                }}
                            >
                                delete
                            </button>
                        </div>

                    </>}
                </div>
            </main>
        </>)
}