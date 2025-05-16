import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
    // Redireciona automaticamente para a página de "Meus Pedidos" (/account/orders)
    return NextResponse.redirect(new URL("/account/orders", request.url));
}
