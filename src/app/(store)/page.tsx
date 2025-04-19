import { Shell } from "@/components/layouts/Shell";
import { ProductCard } from "@/features/products";
import  db  from "@/lib/supabase/db";
import { products } from "@/lib/supabase/schema";
import { Icons } from "@/components/layouts/icons";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function Home() {
  const allProducts = await db.select().from(products);

  return (
    <main className="min-h-screen bg-white text-zinc-800">
      {/* Hero */}
      <section className="w-full h-[70vh] bg-zinc-900 relative text-white flex items-center justify-center">
        <Image
          src="/assets/hero-coffee.jpg"
          alt="Café especial"
          fill
          className="object-cover opacity-30"
        />
        <div className="z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">Café de Verdade</h1>
          <p className="mt-2 text-lg">Escolha sua dose: 1, 3, 6 ou 12 unidades</p>
          <Link
            href="#produtos"
            className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-block")}
          >
            Ver Produtos
          </Link>
        </div>
      </section>

      <Shell>
        {/* Produtos */}
        <section id="produtos" className="mt-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Nossos Cafés</h2>
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">Nenhum produto disponível ainda.</p>
          )}
        </section>

        {/* Benefícios */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24 text-center">
          <div>
            <Icons.package className="mx-auto text-zinc-400 mb-4" width={40} height={40} />
            <h3 className="text-lg font-medium">Entrega</h3>
            <p className="text-sm text-zinc-600">Receba seu café dentro de 7 a 14 dias úteis.</p>
          </div>
          <div>
            <Icons.tag className="mx-auto text-zinc-400 mb-4" width={40} height={40} />
            <h3 className="text-lg font-medium">Preço justo</h3>
            <p className="text-sm text-zinc-600">Sem surpresas. Sem taxas escondidas.</p>
          </div>
          <div>
            <Icons.award className="mx-auto text-zinc-400 mb-4" width={40} height={40} />
            <h3 className="text-lg font-medium">Produtos selecionados</h3>
            <p className="text-sm text-zinc-600">Qualidade acima de tudo.</p>
          </div>
        </section>
      </Shell>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white text-center py-6 mt-16">
        {/* <p className="text-sm">&copy; {new Date().getFullYear()} Café Store. Todos os direitos reservados.</p> */}
        <p className="text-sm">&copy; 2024 Café Store. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
