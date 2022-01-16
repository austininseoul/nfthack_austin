import { supabase } from "../../lib/supabase";
import * as React from 'react'
import { useForm } from "react-hook-form";
import { Event } from '../../types'
import { Navbar } from "../../components/Navbar";

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
        await supabase.from('posts').insert({ title: formData.event_name.replace(" ", "-"), address: formData.event_address, max_tickets: formData.max_tickets })
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-900 text-white">
                <h1 className="text-5xl font-black text-center">
                    Dashboard
                </h1>
                <div className="container mx-auto grid grid-cols-1 gap-4 w-1/2 py-12">

                    {(!create && event === null) && <button
                        className="bg-green-500 text-white p-4 rounded-xl text-2xl font-bold"
                        onClick={() => {
                            alert('creating tickets')
                            setCreate(true)

                        }
                        }
                    >
                        create event
                    </button>}
                    {create && <>
                        <form className="grid grid-cols-1" onSubmit={handleSubmit(onSubmit)}>
                            <p className="text-2xl font-black text-center">enter event details</p>
                            <input required={true} className="text-white rounded-xl p-2 my-2 bg-slate-700" {...register("event_name")} placeholder="event name" />
                            <input required={true} className="text-white rounded-xl p-2 my-2 bg-slate-700" {...register("event_address")} placeholder="event address" />
                            <input required={true} className="text-white rounded-xl p-2 my-2 bg-slate-700"{...register("max_tickets")} placeholder="# of tickets" type="number" />
                            <button type="submit" className="bg-green-500 text-white p-4 rounded-xl text-2xl font-bold" >create</button>
                        </form></>}

                    {event && <>
                        <h1 className="text-5xl font-black text-center">
                            {event.event_name}
                        </h1>
                        <p className="font-mono">event address: <a href={`https://etherscan.io/address/${event.event_address}`}>0x1bw3...b4</a></p>
                        <div className="grid grid-cols-2">
                            <p className="text-xl font-black text-center">
                                Remaining Tickets: ({event.max_tickets})
                            </p>
                            <p className="text-xl font-black text-center">
                                Max Tickets: ({event.max_tickets})
                            </p></div>
                        <p className="font-mono">by default all items at address are valid tickets</p>
                        <h1 className="text-5xl font-black text-center">
                            My Portal: <a href={`http://localhost:3000/portal/${event.event_name.replace(' ', '-')}`} className="text-blue-500">{`${event.event_name}`}</a>
                        </h1>
                        <button
                            className="bg-blue-500 text-white p-4 rounded-xl text-2xl font-bold"
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
                            }}
                        >
                            delete
                        </button>
                    </>}
                </div>
            </main>
        </>)
}