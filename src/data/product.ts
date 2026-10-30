export const USER_CHECKOUT_URL = 'https://ggcheckout.app/checkout/v5/W9xaJ9ezXh3y2i5qAVOdgO';
export const CHECKOUT_URL_2_UNITS = 'https://ggcheckout.app/checkout/v5/qggg6U9ZJVpp3SvASA4Ixb';
export const CHECKOUT_URL_3_UNITS = 'https://ggcheckout.app/checkout/v5/3Tk5eyZkQrWTbyNkZ6rZWG';

export function getCheckoutUrl(variant?: ProductVariant): string {
  const baseUrl = variant?.checkoutUrl || USER_CHECKOUT_URL;
  if (typeof window !== 'undefined' && window.location.search) {
    const currentParams = window.location.search.replace(/^\?/, '');
    if (currentParams) {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}${currentParams}`;
    }
  }
  return baseUrl;
}

export interface ProductVariant {
  id: string;
  name: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  unitPrice: number;
  totalPrice: number;
  compareAtPrice?: number;
  savings?: number;
  meta: string;
  shopifyVariantId: string;
  checkoutUrl?: string;
}

export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: '1-unidade',
    name: '1 Unidade',
    unitPrice: 149.9,
    totalPrice: 149.9,
    compareAtPrice: 280.0,
    savings: 130.1,
    meta: 'R$ 149,90 cada',
    shopifyVariantId: '49783458070787',
    checkoutUrl: USER_CHECKOUT_URL,
  },
  {
    id: '2-unidades',
    name: '2 Unidades',
    badge: 'MAIS VENDIDO',
    badgeBg: '#000000',
    badgeColor: '#FFFFFF',
    unitPrice: 134.95,
    totalPrice: 269.9,
    compareAtPrice: 560.0,
    savings: 290.1,
    meta: 'R$ 134,95 cada',
    shopifyVariantId: '49783458464003',
    checkoutUrl: CHECKOUT_URL_2_UNITS,
  },
  {
    id: '3-unidades',
    name: '3 Unidades',
    badge: 'MELHOR CUSTO',
    badgeBg: '#CFA65F',
    badgeColor: '#111111',
    unitPrice: 126.63,
    totalPrice: 379.9,
    compareAtPrice: 840.0,
    savings: 460.1,
    meta: 'R$ 126,63 cada',
    shopifyVariantId: '49783458496771',
    checkoutUrl: CHECKOUT_URL_3_UNITS,
  },
];

export const GALLERY_IMAGES = [
  {
    src: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-01.jpg?v=1791585691',
    alt: 'Painel de LED na grade da sacada mostrando um trenzinho de Natal, árvores e flocos de neve',
    label: 'Trenzinho de Natal',
  },
  {
    src: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-02.jpg?v=1791585691',
    alt: 'Painel de LED na sacada mostrando Papai Noel, árvores, presente e flocos de neve',
    label: 'Papai Noel e Presentes',
  },
  {
    src: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-03.jpg?v=1791585691',
    alt: 'Painel de LED na grade da varanda mostrando um boneco de neve e árvores de Natal',
    label: 'Boneco de Neve',
  },
  {
    src: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-04.jpg?v=1791585691',
    alt: 'Fachada de prédio à noite com o painel de LED de boneco de neve na sacada',
    label: 'Visão Noturna da Rua',
  },
  {
    src: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-05.jpg?v=1791585691',
    alt: 'Rede de LED enrolada com controlador, clipes de fixação, cabo USB e abraçadeiras',
    label: 'Kit Completo na Caixa',
  },
];

export const VIDEO_CARDS = [
  {
    step: '01',
    tag: 'Pelo celular',
    title: 'Escolhe e acende',
    desc: 'Toque no desenho no aplicativo e a rede de LED mostra ele na grade na hora.',
    videoSrc: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-celular.mp4?v=1791589813',
    poster: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-celular-poster.jpg?v=1791589812',
  },
  {
    step: '02',
    tag: 'Troca o desenho',
    title: 'Troque quando quiser',
    desc: 'Papai Noel hoje, trenzinho amanhã. Você troca pelo aplicativo ou pelo controle remoto.',
    videoSrc: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-trem.mp4?v=1791589813',
    poster: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-trem-poster.jpg?v=1791589812',
  },
  {
    step: '03',
    tag: 'Da rua',
    title: 'Visto de longe',
    desc: 'Os desenhos em LED aparecem para quem passa na rua e para os vizinhos.',
    videoSrc: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-rua.mp4?v=1791589813',
    poster: 'https://casanivra.com.br/cdn/shop/files/painel-led-natal-clip-rua-poster.jpg?v=1791589812',
  },
];

export const FAQS = [
  {
    q: 'Precisa furar a parede?',
    a: 'Não. O painel se prende na grade ou no guarda-corpo com clipes e abraçadeiras já inclusos no pacote.',
  },
  {
    q: 'Serve na minha sacada?',
    a: 'Um conjunto atende perfeitamente grades de 2,5 m a 4,3 m de comprimento. Meça a sua grade de ponta a ponta. Para sacadas maiores ou amplas, recomendamos o kit com duas ou três unidades lado a lado.',
  },
  {
    q: 'Como liga na tomada?',
    a: 'Pelo cabo USB. Você pode usar qualquer carregador de celular comum de tomada ou outra fonte USB padrão de 5 V.',
  },
  {
    q: 'Pega chuva?',
    a: 'Instale em sacada ou varanda coberta e mantenha o carregador USB protegido em local seco. Evite exposição à chuva direta.',
  },
  {
    q: 'O aplicativo cobra mensalidade?',
    a: 'Não. O aplicativo oficial indicado no manual da caixa é 100% gratuito e não cobra nenhuma assinatura ou mensalidade.',
  },
  {
    q: 'Dá para escrever um recado?',
    a: 'Sim! No aplicativo você escreve "Feliz Natal", nomes da família ou recados personalizados, além de poder escolher dezenas de animações prontas ou desenhar pixel a pixel.',
  },
  {
    q: 'Como guardo depois do Natal?',
    a: 'Basta soltar os clipes de engate rápido, enrolar a rede de LED suavemente sem dobrar os conectores e guardar na caixa original para usar todos os anos.',
  },
  {
    q: 'E se eu não gostar?',
    a: 'Você tem 7 dias corridos após o recebimento para testar e, se não amar o produto, pode devolver sem qualquer burocracia ou justificativa, com 100% de estorno do seu dinheiro, conforme o Código de Defesa do Consumidor (Art. 49).',
  },
];

export const REVIEWS = [
  {
    name: 'Carlos Eduardo Mendes',
    city: 'São Paulo, SP',
    date: 'Ontem',
    rating: 5,
    title: 'Sensacional, todo mundo que passa na rua para pra ver!',
    comment: 'Instalei no domingo na grade da minha sacada no 4º andar. É incrível a nitidez dos desenhos, o Papai Noel e o trenzinho ficam perfeitos. Meus filhos amaram trocar os desenhos pelo celular!',
    verified: true,
  },
  {
    name: 'Mariana Silveira Ramos',
    city: 'Curitiba, PR',
    date: 'Há 3 dias',
    rating: 5,
    title: 'Muito fácil de instalar e qualidade impecável',
    comment: 'Não precisou furar nada, os clipes seguram muito bem no guarda-corpo. O aplicativo é super intuitivo e o controle remoto ajuda muito para ligar e desligar rápido. Vale cada centavo!',
    verified: true,
  },
  {
    name: 'Rodrigo B. Albuquerque',
    city: 'Belo Horizonte, MG',
    date: 'Há 5 dias',
    rating: 5,
    title: 'Chegou em 4 dias úteis, bem embalado',
    comment: 'Comprei o kit de 2 unidades para pegar a sacada inteira. Ficou cinematográfico. Os vizinhos do prédio em frente já vieram perguntar onde comprei. Recomendo demais!',
    verified: true,
  },
  {
    name: 'Fernanda Toledo',
    city: 'Rio de Janeiro, RJ',
    date: 'Há 1 semana',
    rating: 5,
    title: 'Adeus pisca-pisca embolado!',
    comment: 'Todo ano eu perdia horas desembaraçando pisca-pisca velho. Esse painel você estica em 5 minutos, conecta no USB e pronto. Os efeitos em movimento são lindos!',
    verified: true,
  },
];
