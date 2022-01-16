import Link from "next/link"

export const Navbar = ({ props, href }) => {
    return <nav className="py-4 px-8 fixed inset-0 bg-transparent w-full h-14 backdrop-blur-md text-indigo-600 z-0">

        <div className="flex justify-between font-bold  items-center">
            <span className="text-black font-black text-2xl">🎨NFTPortal</span>
            <div className="flex space-x-5"><Link href="/user/dashboard">Dashboard</Link>
                {href ? <a href={href} >My Portal</a> : null}
            </div>
        </div>
    </nav>
}