import { NextResponse } from "next/server";
import fetch from "node-fetch";
import supabase from "@/lib/supabase/client";

// Token da PrimePag - Substitua aqui pelo seu token
const PRIMEPAG_TOKEN = "Bearer SEU_TOKEN_DE_AUTENTICACAO";

export async function POST(request: Request) {
    const { paymentMethod, userId, orderProducts } = await request.json();

    if (!userId) {
        return NextResponse.json({ success: false, message: "Usuário não autenticado." });
    }

    // Obtendo os dados do usuário (Nome e CPF)
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, cpf")
        .eq("id", userId)
        .single();

    if (userError || !userData) {
        return NextResponse.json({ success: false, message: "Erro ao obter dados do usuário." });
    }

    // Calculando o valor total com base nos itens do carrinho enviados
    const totalValue = orderProducts.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

    if (paymentMethod === "pix") {
        try {
            const response = await fetch("https://api.primepag.com.br/v1/pix/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": PRIMEPAG_TOKEN
                },
                body: JSON.stringify({
                    value_cents: totalValue,
                    generator_name: userData.name,
                    generator_document: userData.cpf,
                    expiration_time: "1800",
                    external_link: `https://seusite.com/account/orders` // Redireciona para "Meus Pedidos"
                })
            });

            const data = await response.json();
            if (response.ok && data.link) {
                // Salvando o pedido na tabela "orders" com status "Pendente"
                const { data: orderData, error } = await supabase.from("orders").insert({
                    user_id: userId,
                    total_value: totalValue,
                    status: "Pendente",
                    products: orderProducts
                }).select("id").single();

                if (error) throw new Error("Erro ao salvar o pedido.");

                // Simulando atualização para "Pago" (em produção isso seria via webhook)
                setTimeout(async () => {
                    await supabase.from("orders").update({ status: "Pago" }).eq("id", orderData.id);
                }, 5000);

                return NextResponse.json({
                    success: true,
                    qrCodeLink: data.link
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Falha ao gerar o QR Code PIX."
                });
            }
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Erro na integração com PrimePag: " + error.message
            });
        }
    }

    return NextResponse.json({ success: false, message: "Método de pagamento não suportado." });
}
