import type { NavItemWithOptionalChildren } from "@/types";

import { slugify } from "@/lib/utils";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ATACAFÉ",
  description: "A empresa com a razão social CAFE STORE COMERCIO E VAREJO LTDA., opera com o CNPJ 12.056.894/0001-10 e tem sua sede localizada na Rua Barao de Tatui, 387 - Vila Buarque, Sao Paulo - SP, 01.226-030. Seu foco principal de atuação é de Comércio atacadista de mercadorias em geral, com predominância de produtos alimentícios, de acordo com o código CNAE G-4691-5/00",
  url: "https://hiyori.hugo-coding.com",
  address: "Rua Barao de Tatui, 387 - Vila Buarque, Sao Paulo - SP, 01.226-030",
  email: "contato@atacafe.com.br",
  mainNav: [
    {
      title: "Sobre",
      href: "https://github.com/clonglam/HIYORI-master",
      description: "Our Story.",
      items: [],
    },
    {
      title: "Produtos",
      href: "/#produtos",
      description: "Todos os produtos",
      items: [],
    },
    {
      title: "Contato",
      href: "mailto:fulano@a.com?subject=Assunto do email&body=",
      description: "Read our latest blog posts.",
      items: [],
    },
  ] satisfies NavItemWithOptionalChildren[],
};
