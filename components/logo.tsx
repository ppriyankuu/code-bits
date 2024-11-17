import Image from "next/image"
import logo from '@/public/logo.svg'

export const Logo = () => {
    return (
        <div className="w-[8rem] flex items-center gap-1">
         <Image src={ logo } alt="logo" className="w-full" width={ 200 } />
         <p className="text-[#8046FD] font-semibold text-xl">CodeBits</p>
        </div>
    )
}