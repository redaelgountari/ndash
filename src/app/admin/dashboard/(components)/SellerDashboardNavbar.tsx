import { AvatarDropdown } from '@/app/(cpnotrouted)/logout'
import { ModeToggle } from '../../../(cpnotrouted)/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { LayoutDashboard, Box, ShoppingCart, Settings } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Input } from "@/components/ui/input"

function AdminDashboardNavbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b px-3">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <HamburgerMenuIcon />
            <Link href="/admin/dashboard">
              <span className="sr-only">Acceuil</span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <Link href="/admin/dashboard">
                <SheetTitle>Admin Dashboard</SheetTitle>
              </Link>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/admin/dashboard">
                  <Button variant="outline" className="w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </DialogClose>
              {/* <DialogClose asChild>
                <Link href="">
                  <Button variant="outline" className="w-full">
                    <Box className="mr-2 h-4 w-4" />
                    Produits
                  </Button>
                </Link>
              </DialogClose> */}
              <DialogClose asChild>
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commandes
                  </Button>
                </Link>
              </DialogClose>
              {/* <Separator className="my-3" />
              <DialogClose asChild>
                <Link href="">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </Link>
              </DialogClose> */}
            </div>
          </SheetContent>
        </Dialog>
        <Input type="search" placeholder="cherche" style={{width:"60%"}} />

        <div className="flex justify-center items-center gap-2 ml-auto">
          {/* <UserProfile /> */}
          <ModeToggle />
          <AvatarDropdown/>
        </div>
      </header>
      {children}
    </div>
  )
}

export default AdminDashboardNavbar
