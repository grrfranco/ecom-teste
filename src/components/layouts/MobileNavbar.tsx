import { Suspense } from "react";
import CartNav from "../../features/carts/components/CartNav";
import Branding from "./Branding";
import MobileSearchInput from "./MobileSearchInput";
import { SideMenu } from "./SideMenu";
import CartLink from "../../features/carts/components/CartLink";
import Link from "next/link";
import { Icons } from "@/components/layouts/icons"; // Certifique-se de importar o ícone de usuário aqui

type Props = { adminLayout: boolean };

function MobileNavbar({ adminLayout }: Props) {
  const iconSize = 30;

  return (
    <div className="md:hidden flex gap-x-6 justify-between items-center h-[64px]">
      <div className="flex gap-x-3 items-center">
        <SideMenu iconWidth={iconSize} />
        {/* <MobileSearchInput /> */}
      </div>

      <Branding />

      {/* Ícone de login */}
      <Link href="/sign-in" className="flex items-center">
        <Icons.user width={iconSize} height={iconSize} />
      </Link>

      <Suspense fallback={<CartLink productCount={0} />}>
        {!adminLayout && <CartNav />}
      </Suspense>
    </div>
  );
}

export default MobileNavbar;
