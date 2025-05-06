import Image from 'next/image'
import Link from 'next/link'

const Sidebar = ({user}: SidebarProps) => {
  return (
    <section className="sidebar">
        <nav className="flex flex-col gap-4 w-full">
            <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
                <Image
                    src="icons/logo.svg"
                    width={34}
                    height={34}
                    alt="Logo"
                    className="size-[24px] max-xl:size-14"
                />
                <h1 className="text-primary font-bold text-[26px] text-black-1 max-xl:hidden 2xl:text-26">
                    uomi
                </h1>
            </Link>
            <Link href="/">
                Group 1
            </Link>
            
        </nav>
    (User Info)
    </section> 
  )
}

export default Sidebar