import Image from "next/image"
import logo from '@/public/share.png'

export const Logo = () => {
    return (
        <div className="w-[8rem] rounded-full overflow-hidden mb-5">
            <Image src={logo} alt="logo" className="w-full" />
        </div>
    )
}