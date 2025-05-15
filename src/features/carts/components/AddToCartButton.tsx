"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Suspense } from "react";

import { Icons } from "@/components/layouts/icons";
import { Button, ButtonProps } from "@/components/ui/button";
import useCartActions from "../hooks/useCartActions";

interface AddToCartButtonProps extends ButtonProps {
  productId: string;
  quantity?: number;
  cartId?: string;
}

function AddToCartButton({ productId, quantity = 1 }: AddToCartButtonProps) {
  const { user } = useAuth();
  const { addProductToCart } = useCartActions(user, productId);

  return (
    <Suspense>
      <Button
        className="w-full"
        onClick={() => addProductToCart(quantity)}
      >
        {/* <Icons.basket className="h-5 w-5 md:h-4 md:w-4" /> */}
        Adicionar ao carrinho
      </Button>
    </Suspense>
  );
}

export default AddToCartButton;
