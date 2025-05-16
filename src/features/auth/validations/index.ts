import { z } from "zod";

// Schema de Login (Auth)
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

// Schema de Cadastro (SignUp)
export const signupSchema = z.object({
  email: z.string().email({
    message: "Por favor, coloque um email válido",
  }),
  name: z.string().nonempty("O nome é obrigatório."),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: "Digite um CPF válido (000.000.000-00)",
    })
    .nonempty("O CPF é obrigatório."),
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
