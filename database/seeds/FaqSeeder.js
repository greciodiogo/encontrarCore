'use strict'

/*
|--------------------------------------------------------------------------
| FaqSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class FaqSeeder {
  async run () {
    // Verificar se já existem FAQs
    const existingFaqs = await Database.table('faqs').count('* as total')
    const total = existingFaqs[0].total
    
    console.log(`📊 FAQs existentes: ${total}`)
    
    // Se já existem FAQs, apenas atualizar o registro existente
    if (total > 0) {
      console.log('⚠️  FAQs já existem. Atualizando registro existente...')
      
      // Atualizar o primeiro registro com dados completos
      await Database.table('faqs')
        .where('id', 1)
        .update({
          question: 'Como faço um pedido?',
          answer: 'Para fazer um pedido, navegue pelos produtos, adicione os itens desejados ao carrinho e finalize a compra. Você pode escolher entre entrega ou retirada na loja.',
          question_en: 'How do I place an order?',
          answer_en: 'To place an order, browse products, add desired items to cart and complete checkout. You can choose between delivery or store pickup.',
          category: 'orders',
          order: 1,
          is_active: true
        })
      
      console.log('✅ Registro existente atualizado!')
    }
    
    // Adicionar novas FAQs (verificar se já existem antes)
    const faqsToInsert = [
      // FAQs sobre Pedidos
      {
        question: 'Posso cancelar meu pedido?',
        answer: 'Sim, você pode cancelar seu pedido antes dele ser processado pela loja. Acesse "Meus Pedidos" e selecione a opção de cancelamento.',
        question_en: 'Can I cancel my order?',
        answer_en: 'Yes, you can cancel your order before it is processed by the store. Go to "My Orders" and select the cancellation option.',
        category: 'orders',
        order: 2,
        is_active: true
      },
      {
        question: 'Como acompanho meu pedido?',
        answer: 'Você pode acompanhar seu pedido em tempo real através da seção "Meus Pedidos". Você receberá notificações sobre cada etapa do processo.',
        question_en: 'How do I track my order?',
        answer_en: 'You can track your order in real-time through the "My Orders" section. You will receive notifications about each step of the process.',
        category: 'orders',
        order: 3,
        is_active: true
      },
      {
        question: 'Qual o prazo de entrega?',
        answer: 'O prazo de entrega varia de acordo com a loja e sua localização. Você pode ver o tempo estimado antes de finalizar o pedido.',
        question_en: 'What is the delivery time?',
        answer_en: 'Delivery time varies according to the store and your location. You can see the estimated time before completing your order.',
        category: 'orders',
        order: 4,
        is_active: true
      },
      
      // FAQs sobre Pagamento
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos pagamento em dinheiro, cartão de débito, cartão de crédito e pagamento digital. As opções disponíveis podem variar por loja.',
        question_en: 'What payment methods are accepted?',
        answer_en: 'We accept cash, debit card, credit card and digital payment. Available options may vary by store.',
        category: 'payment',
        order: 1,
        is_active: true
      },
      {
        question: 'É seguro pagar pelo app?',
        answer: 'Sim, todas as transações são protegidas com criptografia de ponta a ponta. Seus dados de pagamento estão seguros.',
        question_en: 'Is it safe to pay through the app?',
        answer_en: 'Yes, all transactions are protected with end-to-end encryption. Your payment data is secure.',
        category: 'payment',
        order: 2,
        is_active: true
      },
      {
        question: 'Posso pagar na entrega?',
        answer: 'Sim, você pode escolher pagar na entrega com dinheiro ou cartão, dependendo das opções oferecidas pela loja.',
        question_en: 'Can I pay on delivery?',
        answer_en: 'Yes, you can choose to pay on delivery with cash or card, depending on the options offered by the store.',
        category: 'payment',
        order: 3,
        is_active: true
      },
      
      // FAQs sobre Entrega
      {
        question: 'Qual o valor da taxa de entrega?',
        answer: 'A taxa de entrega varia de acordo com a distância e a loja. Você pode ver o valor exato antes de finalizar o pedido.',
        question_en: 'What is the delivery fee?',
        answer_en: 'The delivery fee varies according to distance and store. You can see the exact amount before completing your order.',
        category: 'delivery',
        order: 1,
        is_active: true
      },
      {
        question: 'Posso agendar a entrega?',
        answer: 'Sim, você pode escolher um horário específico para receber seu pedido durante o processo de checkout.',
        question_en: 'Can I schedule delivery?',
        answer_en: 'Yes, you can choose a specific time to receive your order during the checkout process.',
        category: 'delivery',
        order: 2,
        is_active: true
      },
      {
        question: 'Entregam em toda a cidade?',
        answer: 'A área de entrega varia por loja. Você pode verificar se sua localização está na área de cobertura ao adicionar seu endereço.',
        question_en: 'Do you deliver throughout the city?',
        answer_en: 'Delivery area varies by store. You can check if your location is in the coverage area when adding your address.',
        category: 'delivery',
        order: 3,
        is_active: true
      },
      
      // FAQs sobre Conta
      {
        question: 'Como criar uma conta?',
        answer: 'Você pode criar uma conta usando seu email, número de telefone ou conta do Google. Basta clicar em "Criar conta" na tela inicial.',
        question_en: 'How do I create an account?',
        answer_en: 'You can create an account using your email, phone number or Google account. Just click "Create account" on the home screen.',
        category: 'account',
        order: 1,
        is_active: true
      },
      {
        question: 'Esqueci minha senha, o que faço?',
        answer: 'Na tela de login, clique em "Esqueci minha senha" e siga as instruções para redefinir sua senha.',
        question_en: 'I forgot my password, what do I do?',
        answer_en: 'On the login screen, click "Forgot password" and follow the instructions to reset your password.',
        category: 'account',
        order: 2,
        is_active: true
      },
      {
        question: 'Como alterar meus dados pessoais?',
        answer: 'Acesse "Perfil" no menu de configurações e edite suas informações pessoais.',
        question_en: 'How do I change my personal information?',
        answer_en: 'Go to "Profile" in the settings menu and edit your personal information.',
        category: 'account',
        order: 3,
        is_active: true
      },
      
      // FAQs Gerais
      {
        question: 'O app é gratuito?',
        answer: 'Sim, o app é totalmente gratuito para download e uso. Você paga apenas pelos produtos que comprar.',
        question_en: 'Is the app free?',
        answer_en: 'Yes, the app is completely free to download and use. You only pay for the products you buy.',
        category: 'general',
        order: 1,
        is_active: true
      },
      {
        question: 'Como entro em contato com o suporte?',
        answer: 'Você pode entrar em contato através do email suporte@encontrarshopping.com ou pelo chat dentro do app.',
        question_en: 'How do I contact support?',
        answer_en: 'You can contact us via email at suporte@encontrarshopping.com or through the in-app chat.',
        category: 'general',
        order: 2,
        is_active: true
      },
      {
        question: 'Posso usar o app sem criar uma conta?',
        answer: 'Sim, você pode navegar pelos produtos sem criar uma conta, mas precisará de uma conta para fazer pedidos.',
        question_en: 'Can I use the app without creating an account?',
        answer_en: 'Yes, you can browse products without creating an account, but you will need an account to place orders.',
        category: 'general',
        order: 3,
        is_active: true
      }
    ]
    
    // Inserir FAQs que ainda não existem
    let inserted = 0
    for (const faq of faqsToInsert) {
      const exists = await Database.table('faqs')
        .where('question', faq.question)
        .first()
      
      if (!exists) {
        await Database.table('faqs').insert(faq)
        inserted++
      }
    }
    
    console.log(`✅ ${inserted} novas FAQs adicionadas!`)
    
    // Mostrar resumo
    const finalCount = await Database.table('faqs').count('* as total')
    console.log(`📊 Total de FAQs no banco: ${finalCount[0].total}`)
  }
}

module.exports = FaqSeeder
