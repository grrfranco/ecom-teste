"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import Link from "next/link"
import { Icons } from "./icons"
import Branding from "./Branding"
import SocialMedias from "./SocialMedias"
import CloseButton from "../ui/CloseButton"
import { useState } from "react"



export function SideMenu({ iconWidth }: { iconWidth: number }) {
  const [isOpen, setIsOpen] = useState(false)  // Controlar se o menu está aberto ou fechado
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
      <Button variant="ghost" className="p-0" onClick={() => setIsOpen(true)}>
          <Icons.menu width={iconWidth} height={iconWidth} />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-full md:max-w-xl"
        closeButtonClassName="w-6 h-6 md:w-10 md:h-10"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-gray-800 text-white p-4 mr-[-1px]">
          <div className="flex items-center">
            <Icons.user className="mr-2" />
            <span>Olá, Usuário</span>
          </div>
          <button className="text-white" onClick={() => setIsOpen(false)}>
            <Icons.close width={20} height={20} />
          </button>
        </div>

        {/* Navegação */}
        <div className="grid py-8 gap-y-6 ml-12 md:ml-[96px] mt-[100px]">
          {siteConfig.mainNav.map(({ title, href }, index) => (
            <Link key={index} href={href} className="text-4xl md:text-3xl">
              {title}
            </Link>
          ))}
        </div>

        <SheetFooter className="fixed grid bottom-[96px] ml-12 md:ml-[96px] space-x-0">
          <div className="mb-8 text-muted-foreground">
            <p className="text-xs md:text-sm ml-0">{siteConfig.address}</p>
            <p className="text-xs md:text-sm ml-0">
              <span>{siteConfig.phone}</span> {` / `}
              <Link
                className="hover:underline hover:text-primary"
                href={`mailto:${siteConfig.email}`}
              >
                {siteConfig.email}
              </Link>
            </p>
          </div>

          {/* <SocialMedias /> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
