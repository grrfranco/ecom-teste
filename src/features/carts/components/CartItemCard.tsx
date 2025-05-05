"use client";

import Image from "next/image";
import React from "react";
import QuantityInput from "../../../components/layouts/QuantityInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { keytoUrl } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "../../../components/layouts/icons";
import { Button } from "../../../components/ui/button";

// Tipo do produto, compatível com REST do Supabase
type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  description: string;
  images: string[]; // usado diretamente como URL
};

type CartItemCardProps = React.ComponentProps<typeof Card> & {
  product: Product;
  disabled?: boolean;
  addOneHandler: () => void;
  minusOneHandler: () => void;
  removeHandler: () => void;
  quantity: number;
};

function CartItemCard({
  product,
  disabled,
  addOneHandler,
  minusOneHandler,
  removeHandler,
  quantity,
}: CartItemCardProps) {
  const imageUrl = product.images?.[0] ?? ""; // fallback

  return (
    <Card className="flex items-center justify-between gap-x-6 gap-y-8 px-5 py-3 shadow-none border-0 border-b">
      <CardContent className="relative p-0 mb-5 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={150}
            height={150}
            className="aspect-square object-cover"
          />
        ) : (
          <div className="w-[150px] h-[150px] bg-gray-200 flex items-center justify-center text-sm">
            Sem imagem
          </div>
        )}
      </CardContent>

      <CardHeader className="p-0 mb-3 md:mb-5 grow max-w-lg">
        <CardTitle>
          <Link href={`/shop/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </CardTitle>

        <CardDescription className="grow line-clamp-2">
          {product.description}
        </CardDescription>

        <QuantityInput
          value={quantity}
          addOneHandler={addOneHandler}
          minusOneHandler={minusOneHandler}
          disabled={disabled}
        />
      </CardHeader>

      <CardFooter className="gap-x-2 md:gap-x-5 p-0">
        <p>R$ {(product.price / 100).toFixed(2)}</p>

        <Button
          aria-label="Botão de remover item"
          variant="ghost"
          onClick={removeHandler}
        >
          <Icons.close size={20} />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartItemCard;
