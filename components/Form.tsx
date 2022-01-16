import * as React from "react";
import { useForm } from "react-hook-form";
import { Ticket, TicketOwner } from '../types'
import { useMoralis } from 'react-moralis'
import { useRouter } from "next/router";

export const Form = ({ address, props }) => {
  const { register, handleSubmit } = useForm();
  const [ticketowner, setTicketOwner] = React.useState<TicketOwner>({ owner_address: address, tickets: [] })
  const { Moralis, logout } = useMoralis()
  const [loading, setLoading] = React.useState<boolean>(false)
  const router = useRouter()

  const onSubmit = async () => {
    setLoading(true)
    await Moralis.Web3API.account.getNFTs({ chain: 'eth', address: ticketowner.owner_address })
      .then((res) => {

        let tickets: Array<Ticket> = res.result?.map((e) => {

          if (e.token_address === props.token.contract_address && e.token_id === props.token.ticket_id) {
            //return a Ticket object
            alert('you have a ticket!')
            return {
              user_address: ticketowner.owner_address,
              contract_address: e.token_address,
              token_id: e.token_id,
              validity: true,
              name: e.name
            }

          }
        })
        if (tickets[0] !== undefined) {
          setTicketOwner({ owner_address: address, tickets: tickets })
        } else {
          setTicketOwner({ owner_address: address, tickets: [] })
        }

        setLoading(false)
        logout()
        //redirect / ping some api

      })
  }


  return (
    <>

      <form className="container mx-auto font-bold grid grid-cols-2 w-1/2 gap-2 " onSubmit={handleSubmit(onSubmit)}>
        <label className="text-2xl font-bold">Concert Address</label>
        <input disabled={true} className="text-white rounded-xl p-2 my-2 bg-slate-700" {...register("contract_address")} placeholder="Concert Address" value={props.token.contract_address} />
        <label className="text-2xl font-bold">Ticket ID</label>
        <input disabled={true} className="text-white rounded-xl p-2 my-2  bg-slate-700" {...register("ticket_id")} placeholder="Ticket Number" value={props.token.ticket_id} />

        <button className="col-span-2 w-full bg-red-500 disabled:bg-red-800 text-white p-4 rounded-xl text-2xl font-bold" disabled={loading} type="submit" >check</button>
      </form>
      <p className="font-mono">{JSON.stringify(ticketowner)}</p>
      <h1 className="text-4xl font-bold text-center">tickets({ticketowner.tickets.length})</h1>
    </>
  );


}
