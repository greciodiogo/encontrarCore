module.exports = (userName, logoUrl) => {
  // Se não passar logoUrl, usa o padrão
  const logo = logoUrl || 'https://encontrarshopping.com/logo-encontrar.png';
  
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acesso Exclusivo - Teste Beta Encontrar</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px 0;">
        <tr>
            <td align="center">
                <!-- Container Principal -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="">
                            <img src="${logo}" alt="Encontrar" style="width: 200px; height: 160px; object-fit: contain; object-position: center;" />
                        </td>
                    </tr>
                    
                    <!-- Header com Emoji -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #DC9E00 0%, #FDB913 100%); padding: 30px 20px;">
                            <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">ACESSO EXCLUSIVO</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">Teste a Nova App Encontrar</p>
                        </td>
                    </tr>
                    
                    <!-- Conteúdo -->
                    <tr>
                        <td style="padding: 40px 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 18px; color: #333333; font-weight: 600;">
                                Olá${userName ? ', ' + userName : ''}! 👋
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.8;">
                                Temos uma excelente novidade para si! 🚀
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.8;">
                                Foi selecionado para participar no nosso <strong style="color: #DC9E00;">Programa Exclusivo de Testes</strong> da nova versão da App Encontrar.
                            </p>
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #666666; line-height: 1.8;">
                                Nesta fase, o acesso está disponível apenas para <strong>utilizadores Android</strong>, através da Google Play.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Como Participar -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background-color: #f8f8f8; border-left: 4px solid #DC9E00; padding: 20px; border-radius: 5px;">
                                <h3 style="margin: 0 0 15px 0; color: #DC9E00; font-size: 18px;">💬 Como participar:</h3>
                                <ol style="margin: 0; padding-left: 20px; color: #666666; font-size: 15px; line-height: 1.8;">
                                    <li style="margin-bottom: 10px;">Aceder ao link abaixo no seu dispositivo Android</li>
                                    <li style="margin-bottom: 10px;">Instalar a aplicação</li>
                                    <li style="margin-bottom: 10px;">Utilizar normalmente e enviar o seu feedback</li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Botão -->
                    <tr>
                        <td align="center" style="padding: 0 40px 30px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="border-radius: 50px; background: linear-gradient(135deg, #DC9E00 0%, #FDB913 100%); box-shadow: 0 4px 15px rgba(220, 158, 0, 0.3);">
                                        <a href="https://play.google.com/store/apps/details?id=co.ao.encontrar_mobile_app" 
                                           style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 50px;">
                                            👉 Instalar Agora
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Recompensa -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%); border-radius: 10px; padding: 25px; text-align: center;">
                                <div style="font-size: 36px; margin-bottom: 10px;">🎁</div>
                                <h3 style="margin: 0 0 10px 0; color: #DC9E00; font-size: 20px; font-weight: bold;">Recompensa para Participantes Ativos</h3>
                                <p style="margin: 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Todos os testers ficam habilitados a ganhar <strong style="color: #DC9E00;">cupões com mais de 10.000 Kz em descontos</strong> para usar na nossa plataforma.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Importância -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <p style="margin: 0 0 15px 0; font-size: 16px; color: #666666; line-height: 1.8;">
                                A sua participação é muito importante para nós. Está a ajudar-nos a melhorar a experiência antes do lançamento oficial.
                            </p>
                            <p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.8;">
                                <strong style="color: #DC9E00;">Contamos consigo!</strong> 💙
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Assinatura -->
                    <tr>
                        <td style="padding: 0 40px 40px;">
                            <p style="margin: 0 0 5px 0; font-size: 16px; color: #333333; font-weight: 600;">
                                Com os melhores cumprimentos,
                            </p>
                            <p style="margin: 0; font-size: 16px; color: #DC9E00; font-weight: 600;">
                                Equipa Encontrar
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Nota -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="border-top: 1px solid #eeeeee; padding-top: 20px;">
                                <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6; text-align: center;">
                                    Este é um email automático. Por favor não responda a este email.<br/>
                                    Se precisar de ajuda, entre em contacto com: <a href="mailto:suporte@encontrarshopping.com" style="color: #DC9E00; text-decoration: none;">suporte@encontrarshopping.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #DC9E00 0%, #FDB913 100%); padding: 25px;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: 600;">
                                © ${new Date().getFullYear()} Encontrar Shopping
                            </p>
                            <p style="margin: 0; color: #ffffff; font-size: 12px; opacity: 0.9;">
                                Todos os Direitos Reservados
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
