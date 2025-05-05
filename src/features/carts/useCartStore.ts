import { create } from "zustand";
import { persistNSync } from "persist-and-sync";
import { useMutation } from "urql";
import { createCartMutation, updateCartsMutation } from "./query";

// Representa um item no carrinho: quantidade associada ao ID do produto
export type CartItem = {
  quantity: number;
};

// Estrutura principal do carrinho, mapeado por ID de produto
export type CartItems = { [productId: string]: CartItem };

// Útil para enviar dados do carrinho (ex: salvar ou atualizar no backend)
export type ProductData = { productId: string; quantity: number };

// Interface que define as funções disponíveis na store
type CartStore = {
  cart: CartItems;
  addProductToCart: (id: string, quantity: number) => void;
  removeProduct: (id: string) => void;
  removeAllProducts: () => void;
};

// Criação da store com persistência em localStorage
const useCartStore = create<CartStore>(
  persistNSync(
    (set) => ({
      cart: {},

      // Adiciona ou atualiza um produto no carrinho
      addProductToCart: async (id, quantity) => {
        set((state) => {
          const existingProduct = state.cart[id];
          const newQuantity = existingProduct
            ? existingProduct.quantity + quantity
            : quantity; // Usa a quantidade passada na primeira vez

          return {
            cart: {
              ...state.cart,
              [id]: { quantity: newQuantity },
            },
          };
        });
      },

      // Remove um produto específico do carrinho
      removeProduct: (id) =>
        set((state) => {
          const updatedCart = { ...state.cart };
          delete updatedCart[id];
          return { cart: updatedCart };
        }),

      // Remove todos os produtos do carrinho
      removeAllProducts: () => set(() => ({ cart: {} })),
    }),

    // Aqui está a mudança importante: agora usa localStorage
    {
      name: "cart",
      storage: "localStorage",
    }
  )
);

// Função auxiliar para contar o total de itens no carrinho
export const calcProductCountStorage = (cartItems: CartItems) => {
  if (!cartItems) return 0;
  return Object.values(cartItems).reduce((acc, cur) => acc + cur.quantity, 0);
};

export default useCartStore;
