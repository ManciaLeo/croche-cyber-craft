import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

// Em um ambiente real, esse hash viria do seu banco de dados.
// Este é o hash SHA-256 para a senha "fran123"
const SENHA_CORRETA_HASH = '8f972b9a7f342cc8728a07f0fbb26cba26fc6e1c9b2512f45cc18c1482f6e520'; 
const USUARIO_CORRETO = 'fran';

export async function POST(request: Request) {
  const { usuario, senha } = await request.json();

  // Cria o hash SHA-256 da senha que o usuário digitou
  const hashTentativa = crypto.createHash('sha256').update(senha).digest('hex');

  if (usuario === USUARIO_CORRETO && hashTentativa === SENHA_CORRETA_HASH) {
    // Se a senha bater, cria um cookie de sessão seguro
    (await
          // Se a senha bater, cria um cookie de sessão seguro
          cookies()).set('admin_session', 'autenticado', {
      httpOnly: true, // Protege contra XSS (não acessível via JavaScript)
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    });

    return NextResponse.json({ sucesso: true });
  }

  return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 });
}