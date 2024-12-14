import { Logo } from './logo'

export const Navbar = () => {
    return (
        <div className="flex justify-between items-center w-full px-[11rem] mb-5">
            <Logo />
            <div className="font-semibold text-xl">
                Share your code <span className="text-[#8046FD]">effortlessly</span>.   
            </div>
        </div>
    )
}
