"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { CartItems } from "@/features/carts";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

type CheckoutButtonProps = React.ComponentProps<typeof Button> & {
  order: CartItems;
  totalValue: number;
  guest: boolean;
};

function CheckoutButton({ order, totalValue, guest, ...props }: CheckoutButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const onClickHandler = async () => {
    if (!user) {
      toast({ title: "Você precisa estar logado para finalizar a compra." });
      router.push(`/sign-in?redirect=/cart`); // Agora redireciona para a página correta de login
      return;
    }

    setIsLoading(true);

    // Enviando o pedido diretamente para a API de checkout
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderProducts: order, totalValue, userId: user.id })
    });

    if (!res.ok) {
      toast({ title: "Erro ao iniciar o checkout." });
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    if (data.success && data.qrCodeLink) {
      window.location.href = "/checkout";
    } else {
      toast({ title: "Erro ao gerar o QR Code PIX." });
    }
    setIsLoading(false);
  };

  return (
    <Button
      {...props}
      className={cn("w-full", props.className)}
      onClick={onClickHandler}
      disabled={isLoading}
    >
      {isLoading ? "Carregando..." : "Finalizar Compra"}
      {isLoading && (
        <Spinner className="ml-3 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
    </Button>
  );
}

export default CheckoutButton;
