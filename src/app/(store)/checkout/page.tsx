"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function CheckoutPage() {
    const [paymentMethod, setPaymentMethod] = useState("pix");
    const [cardDetails, setCardDetails] = useState({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
        cpf: ""
    });
    const [qrCodeLink, setQrCodeLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Verificando e resetando as tentativas se passaram mais de 2 horas
    useEffect(() => {
        const savedAttempts = parseInt(localStorage.getItem("card_attempts") || "0");
        const savedTime = localStorage.getItem("card_attempts_time");

        if (savedTime) {
            const elapsedTime = Date.now() - parseInt(savedTime);
            const twoHours = 2 * 60 * 60 * 1000; // 2 horas em milissegundos

            if (elapsedTime >= twoHours) {
                localStorage.removeItem("card_attempts");
                localStorage.removeItem("card_attempts_time");
                setAttempts(0);
                return;
            }
        }

        setAttempts(Math.min(savedAttempts, 3)); // Garantindo que nunca passe de 3
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setQrCodeLink(null);

        if (paymentMethod === "credit") {
            let currentAttempts = attempts + 1;
            currentAttempts = Math.min(currentAttempts, 3);
            setAttempts(currentAttempts);

            // Salvando tentativas e tempo no LocalStorage
            localStorage.setItem("card_attempts", currentAttempts.toString());
            if (!localStorage.getItem("card_attempts_time")) {
                localStorage.setItem("card_attempts_time", Date.now().toString());
            }

            if (currentAttempts >= 3) {
                alert("Você atingiu o número máximo de tentativas. Por favor, utilize outro meio de pagamento.");
                setLoading(false);
                return;
            }

            alert("Erro ao processar o pagamento. Entre em contato com o emissor do cartão.");
            setLoading(false);
            return;
        }

        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentMethod: "pix" })
        });
        const data = await response.json();
        if (data.success) {
            setQrCodeLink(data.qrCodeLink);
        } else {
            alert(data.message || "Erro ao gerar o QR Code PIX.");
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Checkout</h1>
            <p><strong>Tentativas de pagamento com cartão: {Math.min(attempts, 3)} / 3</strong></p>
            <form onSubmit={handlePayment}>
                <div>
                    <label>Método de Pagamento:</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="pix">PIX</option>
                        <option value="credit">Cartão de Crédito</option>
                    </select>
                </div>

                {paymentMethod === "credit" && (
                    <div>
                        <input type="text" placeholder="Nome no Cartão" value={cardDetails.name} 
                               onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} />
                        <input type="text" placeholder="Número do Cartão" value={cardDetails.number} 
                               onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />
                        <input type="text" placeholder="Data de Validade (MM/AA)" value={cardDetails.expiry} 
                               onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                        <input type="text" placeholder="CVV" value={cardDetails.cvv} 
                               onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                        <input type="text" placeholder="CPF" value={cardDetails.cpf} 
                               onChange={(e) => setCardDetails({ ...cardDetails, cpf: e.target.value })} />
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Processando..." : "Finalizar Compra"}
                </button>
            </form>

            {qrCodeLink && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Pagamento via PIX</h2>
                    <Image src={qrCodeLink} alt="QR Code do PIX" width={300} height={300} />
                    <p>Escaneie o QR Code para realizar o pagamento.</p>
                </div>
            )}
        </div>
    );
}
