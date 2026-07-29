import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  // Verifica se o cookie de sessão existe
  const session = request.cookies.get('admin_session');

  // Se tentar acessar o painel sem estar logado, joga pro login
  if (isAdminRoute && !isAuthPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Se tentar acessar a tela de login já estando logado, joga pro painel
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Aplica a regra só para as rotas do admin
};