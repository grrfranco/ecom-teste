"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function UserOrdersPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/auth/signin"); // Redireciona para login se não estiver autenticado
            return;
        }

        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Erro ao carregar pedidos:", error);
                return;
            }

            setOrders(data || []);
            setLoading(false);
        };

        fetchOrders();
    }, [user, router]);

    if (loading) return <p>Carregando seus pedidos...</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h1>Meus Pedidos</h1>
            {orders.length === 0 ? (
                <p>Você ainda não fez nenhum pedido.</p>
            ) : (
                <div>
                    {orders.map((order) => (
                        <div key={order.id} style={{ border: "1px solid #ddd", margin: "10px 0", padding: "10px" }}>
                            <h3>Pedido #{order.id}</h3>
                            <p><strong>Data:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            <p><strong>Valor Total:</strong> R$ {(order.total_value / 100).toFixed(2)}</p>
                            <p><strong>Status:</strong> <span style={{ color: order.status === "Pago" ? "green" : "red" }}>{order.status}</span></p>
                            
                            <p><strong>Produtos:</strong></p>
                            <ul>
                                {order.products.map((product) => (
                                    <li key={product.productId}>
                                        Produto: {product.productId} - Quantidade: {product.quantity} - Preço: R$ {(product.price / 100).toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
