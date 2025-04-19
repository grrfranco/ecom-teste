import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({
    message: "Por favor, coloque um email válido",
  }),
  senha: z
    .string()
    .min(8, {
      message: "Senha deve ter pelo menos 8 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Senha deve conter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial",
    }),
});

export const signupSchema = z.object({
  email: z.string().email({
    message: "Por favor, coloque um email válido",
  }),
  name: z.string(),
  senha: z
    .string()
    .min(8, {
      message: "Senha deve ter pelo menos 8 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "Senha deve conter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial",
    }),
});
