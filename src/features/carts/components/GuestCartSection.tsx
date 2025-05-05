"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import useCartStore, {
  CartItems,
  calcProductCountStorage,
} from "../useCartStore";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyCart from "./EmptyCart";
import CartItemCard from "./CartItemCard";
import CheckoutButton from "./CheckoutButton";
import { useToast } from "@/components/ui/use-toast";

// Tipo do produto esperado
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images: string[];
};

// Componente principal da seção de carrinho para visitantes
function GuestCartSection() {
  const { toast } = useToast();

  // Estado global do carrinho (Zustand)
  const cartItems = useCartStore((s) => s.cart);
  const addProductToCart = useCartStore((s) => s.addProductToCart);
  const removeProduct = useCartStore((s) => s.removeProduct);

  // 🧠 Extrai IDs dos produtos no carrinho, com memoização para evitar re-render infinito
  const cartProductIds = useMemo(() => Object.keys(cartItems), [cartItems]);

  // Estados locais
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Busca os produtos no Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      if (cartProductIds.length === 0) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", cartProductIds);

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        toast({ title: "Erro ao carregar carrinho." });
      } else if (
        data &&
        JSON.stringify(data) !== JSON.stringify(products)
      ) {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [cartProductIds]); // Agora é estável, graças ao useMemo

  // 🧮 Subtotal calculado com base nos produtos e quantidades
  const subtotal = useMemo(() => {
    return products.reduce((acc, cur) => {
      const quantity = cartItems[cur.id]?.quantity ?? 0;
      return acc + quantity * cur.price;
    }, 0);
  }, [products, cartItems]);

  // Contagem total de itens no carrinho
  const productCount = useMemo(
    () => calcProductCountStorage(cartItems),
    [cartItems]
  );

  // 📦 Ações para alterar o carrinho
  const addOneHandler = (productId: string, quantity: number) => {
    if (quantity < 8) {
      addProductToCart(productId, 1);
    } else {
      toast({ title: "Limite de produto atingido." });
    }
  };

  const minusOneHandler = (productId: string, quantity: number) => {
    if (quantity > 1) {
      addProductToCart(productId, -1);
    } else {
      toast({ title: "Mínimo atingido." });
    }
  };

  const removeHandler = (productId: string) => {
    removeProduct(productId);
    toast({ title: "Produto removido." });
  };

  // ⏳ Tela de carregamento
  if (loading) return <LoadingCartSection />;

  // 🙁 Carrinho vazio
  if (!products.length) return <EmptyCart />;

  return (
    <section
      aria-label="Cart Section"
      className="grid grid-cols-12 gap-x-6 gap-y-5"
    >
      {/* Lista de produtos */}
      <div className="col-span-12 md:col-span-9 max-h-[420px] md:max-h-[640px] overflow-y-auto">
        {products.map((product) => (
          <CartItemCard
            key={product.id}
            id={product.id}
            product={product}
            quantity={cartItems[product.id]?.quantity ?? 1}
            addOneHandler={() =>
              addOneHandler(product.id, cartItems[product.id]?.quantity ?? 1)
            }
            minusOneHandler={() =>
              minusOneHandler(product.id, cartItems[product.id]?.quantity ?? 1)
            }
            removeHandler={() => removeHandler(product.id)}
          />
        ))}
      </div>

      {/* Resumo do carrinho */}
      <Card className="w-full h-[180px] px-3 col-span-12 md:col-span-3">
        <CardHeader className="px-3 pt-2 pb-0 text-md">
          <CardTitle className="text-lg mb-0">Subtotal</CardTitle>
          <CardDescription>{`${productCount} itens`}</CardDescription>
        </CardHeader>
        <CardContent className="relative overflow-hidden px-3 py-2">
          <p className="text-3xl md:text-lg lg:text-2xl font-bold">
            R$ {(subtotal / 100).toFixed(2)}
          </p>
        </CardContent>
        <CardFooter className="gap-x-2 md:gap-x-5 px-3">
          <CheckoutButton guest={true} order={cartItems} />
        </CardFooter>
      </Card>
    </section>
  );
}

export default GuestCartSection;

// Skeleton usado enquanto os dados são carregados
export const LoadingCartSection = () => (
  <section
    className="grid grid-cols-12 gap-x-6 gap-y-5"
    aria-label="Loading Skeleton"
  >
    <div className="col-span-12 md:col-span-9 space-y-8">
      {[...Array(4)].map((_, index) => (
        <div
          className="flex items-center justify-between gap-x-6 gap-y-8 border-b p-5"
          key={index}
        >
          <Skeleton className="h-[120px] w-[120px]" />
          <div className="space-y-3 w-full">
            <Skeleton className="h-6 max-w-xs" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </div>
        </div>
      ))}
    </div>
    <div className="w-full h-[180px] px-3 col-span-12 md:col-span-3 border p-5">
      <div className="space-y-3 w-full">
        <Skeleton className="h-6 max-w-xs" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 mb-6" />
        <Skeleton className="h-4 mb-6 max-w-[280px]" />
      </div>
    </div>
  </section>
);