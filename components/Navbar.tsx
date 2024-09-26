import UserButton from '@/components/ui/UserButton'
import { MainNav } from '@/components/main-nav'
import StoreSwitcher from './store-switcher'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Stores } from '@/Models/Store'
import { dbConnect } from '@/lib/mongo/connectDB'

  

const Navbar = async() => {

    const session = await auth()
    const user = session?.user?.name

    if(!user){
        redirect('login')
    }
    await dbConnect()
    const stores = await Stores.find({
        admin : user
    })


    return (
        <div className="border-b ">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores}/>
                <MainNav className='mx-6'/>
                <div className="ml-auto flex items-center space-x-4 ">
                   <UserButton/>
                </div>
            </div>
        </div>
    )
}

export default Navbar