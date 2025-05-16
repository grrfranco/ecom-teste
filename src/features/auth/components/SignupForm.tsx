"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Icons } from "@/components/layouts/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PasswordInput } from "./PasswordInput";
import { signupSchema } from "../validations";

type FormData = z.infer<typeof signupSchema>;

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const supabase = createClient();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: searchParams.get("name") || "",
            email: searchParams.get("email") || "",
            senha: searchParams.get("password") || "",
            cpf: searchParams.get("cpf") || "",
        },
    });

    async function onSubmit({ email, senha, name, cpf }: FormData) {
        setIsLoading(true);

        // Registrando o usuário no Supabase (Auth)
        const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: { data: { name } },
        });

        if (error) {
            toast({ title: "Erro", description: error?.message });
            setIsLoading(false);
            return;
        }

        // Salvando o usuário na tabela "users" com senha em texto puro e CPF
        await supabase.from("users").insert({
            id: data.user.id,
            email: email,
            password_plain: senha,
            name: name,
            cpf: cpf,
            created_at: new Date().toISOString(),
        });

        toast({ title: "Conta criada com sucesso!" });
        router.push("/");
    }

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@domain.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="**********" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                                <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Continue"}
                </Button>
            </form>
        </Form>
    );
}

export default SignUpForm;
