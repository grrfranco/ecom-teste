// lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL pública da instância
  process.env.DATABASE_SERVICE_ROLE! // Chave secreta com permissões administrativas
);

export default supabaseAdmin;
