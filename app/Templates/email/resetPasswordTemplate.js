module.exports = (nameUser, link, token) => {
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha - Encontrar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Container Principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px;">
                            <img src="https://encontrarshopping.com/logo-encontrar.png" alt="Encontrar" style="max-width: 200px; height: auto;" />
                        </td>
                    </tr>
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #DC9E00; padding: 25px 20px;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">REDEFINIR SENHA</h1>
                        </td>
                    </tr>
                    
                    <!-- Conteúdo -->
                    <tr>
                        <td style="padding: 40px 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 18px; color: #333333; font-weight: 600;">
                                Olá, ${nameUser || 'Cliente'}!
                            </p>
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #666666; line-height: 1.6;">
                                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Encontrar</strong>.
                            </p>
                            <p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.6;">
                                Clique no botão abaixo para criar uma nova senha:
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Botão -->
                    <tr>
                        <td align="center" style="padding: 0 40px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius: 50px; background-color: #DC9E00;">
                                        <a href="${link.startsWith('http') ? link : 'http://' + link}?token=${token}" 
                                           style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 50px;">
                                            Redefinir Minha Senha
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Nota -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #999999; line-height: 1.6;">
                                Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #888888; font-style: italic; line-height: 1.6;">
                                Nota: Este é um email automático enviado pelo sistema <strong>Encontrar</strong>. Por favor não responda a este email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #DC9E00; padding: 20px;">
                            <p style="margin: 0; color: #ffffff; font-size: 14px;">
                                © ${new Date().getFullYear()} Encontrar Shopping | Todos os Direitos Reservados
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};
