import Link from 'next/link'
import Image from 'next/image'

export const Logo = () => (
    <header className='bg-white flex items-center justify-center px-6 py-3 w-full shadow-sm border-b border-gray-100' >
        <Link href="/" className='flex items-center gap-1 sm:gap-2 w-fit'>
            <Image src="/logo.svg" alt='Logo' className='w-8 h-8 sm:w-10 sm:h-10' width={40} height={40} />
            <h1 className='font-bold text-[#FF9B4F] text-xl sm:text-2xl'>LibFood</h1>
        </Link>
    </header>
)
