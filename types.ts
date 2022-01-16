export interface Ticket {
    contract_address: string
    token_id: string
    validity: boolean
    user_address: string
    name: string
}

export interface TicketOwner {
    tickets: Array<Ticket>
    owner_address: string
}

export interface Event {
    event_name: string,
    event_address: string,
    max_tickets: number
    tickets: Array<any>
}