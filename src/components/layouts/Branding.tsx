import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";


type Props = { className?: string };

function Branding({ className }: Props) {
  return (
    <Link
      href="/"
      className={cn("text-2xl font-medium align-middle", className)}
    >
      <Image
            src="/assets/logo.png"
            alt=""
            width={400}
            height={400}
            className="w-full max-w-full max-h-[64px] md:max-h-[none]"
        />
        
    </Link>
  );
}

export default Branding;
