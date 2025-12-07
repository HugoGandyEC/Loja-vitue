import { Brand, Category, Product, AdminClient, AdminSupplier, ServiceOrder, ContractTemplate } from '../types';

export const BRANDS: Brand[] = [
  { id: 'b1', name: 'TechNova', logo: 'https://picsum.photos/seed/logo1/100/100' },
  { id: 'b2', name: 'AudioPhile', logo: 'https://picsum.photos/seed/logo2/100/100' },
  { id: 'b3', name: 'ComfortHome', logo: 'https://picsum.photos/seed/logo3/100/100' },
  { id: 'b4', name: 'FitGear', logo: 'https://picsum.photos/seed/logo4/100/100' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'c1',
    name: 'Eletrônicos',
    slug: 'eletronicos',
    subcategories: [
      { id: 's1', name: 'Smartphones', slug: 'smartphones' },
      { id: 's2', name: 'Laptops', slug: 'laptops' },
      { id: 's3', name: 'Acessórios', slug: 'acessorios' },
    ],
  },
  {
    id: 'c2',
    name: 'Áudio',
    slug: 'audio',
    subcategories: [
      { id: 's4', name: 'Headphones', slug: 'headphones' },
      { id: 's5', name: 'Caixas de Som', slug: 'caixas-de-som' },
    ],
  },
  {
    id: 'c3',
    name: 'Casa Inteligente',
    slug: 'casa-inteligente',
    subcategories: [
      { id: 's6', name: 'Iluminação', slug: 'iluminacao' },
      { id: 's7', name: 'Segurança', slug: 'seguranca' },
    ],
  },
];

const generateImages = (seed: string): string[] => {
  return [
    `https://picsum.photos/seed/${seed}_1/800/800`,
    `https://picsum.photos/seed/${seed}_2/800/800`,
    `https://picsum.photos/seed/${seed}_3/800/800`,
    `https://picsum.photos/seed/${seed}_4/800/800`,
  ];
};

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Smartphone X-Pro Ultra',
    description: 'O Smartphone X-Pro Ultra redefine a experiência móvel com sua tela OLED de 6.7 polegadas e processador de última geração. Capture momentos incríveis com o sistema de câmera quádrupla.',
    price: 3499.90,
    oldPrice: 3999.90,
    brandId: 'b1',
    categoryId: 'c1',
    subCategoryId: 's1',
    images: generateImages('phone_xpro'),
    rating: 4.8,
    reviews: 124,
    stock: 15,
    features: ['Tela OLED 120Hz', '5G', '256GB Armazenamento', 'Câmera 108MP'],
  },
  {
    id: 'p2',
    name: 'Laptop Workstation Z',
    description: 'Potência bruta para profissionais. Renderize vídeos em 4K, compile código complexo e execute multitarefas sem esforço.',
    price: 8999.00,
    brandId: 'b1',
    categoryId: 'c1',
    subCategoryId: 's2',
    images: generateImages('laptop_z'),
    rating: 4.9,
    reviews: 45,
    stock: 8,
    features: ['Processador i9', '32GB RAM', '1TB SSD NVMe', 'GPU RTX 4070'],
  },
  {
    id: 'p3',
    name: 'Fone NoiseCancel 3000',
    description: 'Mergulhe na sua música. O cancelamento de ruído ativo líder da indústria bloqueia o mundo exterior.',
    price: 1299.50,
    oldPrice: 1599.00,
    brandId: 'b2',
    categoryId: 'c2',
    subCategoryId: 's4',
    images: generateImages('headphone_nc'),
    rating: 4.7,
    reviews: 320,
    stock: 42,
    features: ['ANC Híbrido', '30h de Bateria', 'Áudio Espacial', 'Conforto Premium'],
  },
  {
    id: 'p4',
    name: 'Smart Speaker Home',
    description: 'Controle sua casa com sua voz. Som preenche a sala e assistente virtual integrado.',
    price: 499.00,
    brandId: 'b3',
    categoryId: 'c3',
    subCategoryId: 's5',
    images: generateImages('speaker_home'),
    rating: 4.5,
    reviews: 89,
    stock: 100,
    features: ['Wi-Fi 6', 'Som 360', 'Hub Zigbee', 'Microfone Far-field'],
  },
  {
    id: 'p5',
    name: 'Câmera de Segurança 360',
    description: 'Monitore sua casa de qualquer lugar. Visão noturna, detecção de movimento e áudio bidirecional.',
    price: 299.90,
    brandId: 'b3',
    categoryId: 'c3',
    subCategoryId: 's7',
    images: generateImages('cam_sec'),
    rating: 4.6,
    reviews: 210,
    stock: 25,
    features: ['1080p HD', 'Visão Noturna', 'IP65', 'Armazenamento em Nuvem'],
  },
  {
    id: 'p6',
    name: 'Tablet Creator Pro',
    description: 'Perfeito para artistas e designers. Acompanha caneta sensível à pressão.',
    price: 2599.00,
    oldPrice: 2899.00,
    brandId: 'b1',
    categoryId: 'c1',
    subCategoryId: 's3',
    images: generateImages('tablet_creator'),
    rating: 4.7,
    reviews: 56,
    stock: 12,
    features: ['Tela Liquid Retina', 'Chip M2', 'Suporte a Stylus', 'Bateria o dia todo'],
  },
];

// ============================================
// CLIENTES
// ============================================

export const MOCK_CLIENTS: AdminClient[] = [
  {
    id: 'cl1',
    name: 'João Silva Santos',
    contact: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    rg: '12.345.678-9',
    cpf: '123.456.789-00',
    addresses: [
      {
        zipCode: '01310-100',
        street: 'Av. Paulista',
        number: '1578',
        district: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        label: 'Principal',
      },
    ],
  },
  {
    id: 'cl2',
    name: 'Maria Oliveira Costa',
    contact: '(21) 97654-3210',
    email: 'maria.oliveira@email.com',
    rg: '98.765.432-1',
    cpf: '987.654.321-00',
    addresses: [
      {
        zipCode: '22041-001',
        street: 'Av. Atlântica',
        number: '2000',
        district: 'Copacabana',
        city: 'Rio de Janeiro',
        state: 'RJ',
        label: 'Principal',
      },
    ],
  },
  {
    id: 'cl3',
    name: 'Carlos Eduardo Mendes',
    contact: '(31) 99876-5432',
    email: 'carlos.mendes@email.com',
    rg: '45.678.901-2',
    cpf: '456.789.012-34',
    addresses: [
      {
        zipCode: '30130-100',
        street: 'Av. Afonso Pena',
        number: '867',
        district: 'Centro',
        city: 'Belo Horizonte',
        state: 'MG',
        label: 'Principal',
      },
    ],
  },
];

// ============================================
// FORNECEDORES
// ============================================

export const MOCK_SUPPLIERS: AdminSupplier[] = [
  {
    id: 'sup1',
    corporateName: 'Tech Distribuidora Ltda',
    name: 'TechDist',
    contact: '(11) 3456-7890',
    email: 'vendas@techdist.com.br',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123.456.789.012',
    addresses: [
      {
        zipCode: '04711-000',
        street: 'Av. das Nações Unidas',
        number: '12901',
        district: 'Brooklin',
        city: 'São Paulo',
        state: 'SP',
        label: 'Matriz',
      },
    ],
    sellerName: 'Roberto Alves',
    sellerContact: '(11) 98888-7777',
    sellerEmail: 'roberto@techdist.com.br',
  },
  {
    id: 'sup2',
    corporateName: 'Audio Premium Comércio S.A.',
    name: 'AudioPremium',
    contact: '(21) 2345-6789',
    email: 'contato@audiopremium.com.br',
    cnpj: '98.765.432/0001-10',
    stateRegistration: '987.654.321.098',
    addresses: [
      {
        zipCode: '20031-170',
        street: 'Av. Rio Branco',
        number: '156',
        district: 'Centro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        label: 'Matriz',
      },
    ],
    sellerName: 'Ana Paula Costa',
    sellerContact: '(21) 97777-6666',
    sellerEmail: 'ana.costa@audiopremium.com.br',
  },
];

// ============================================
// VENDAS
// ============================================

interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod: string;
}

export const MOCK_SALES: Sale[] = [
  {
    id: 'sale1',
    clientId: 'cl1',
    clientName: 'João Silva Santos',
    date: '2025-12-01T10:30:00',
    items: [
      { productId: 'p1', productName: 'Smartphone X-Pro Ultra', quantity: 1, unitPrice: 3499.90 },
      { productId: 'p3', productName: 'Fone NoiseCancel 3000', quantity: 1, unitPrice: 1299.50 },
    ],
    total: 4799.40,
    status: 'completed',
    paymentMethod: 'Cartão de Crédito',
  },
  {
    id: 'sale2',
    clientId: 'cl2',
    clientName: 'Maria Oliveira Costa',
    date: '2025-12-03T14:15:00',
    items: [
      { productId: 'p2', productName: 'Laptop Workstation Z', quantity: 1, unitPrice: 8999.00 },
    ],
    total: 8999.00,
    status: 'completed',
    paymentMethod: 'PIX',
  },
  {
    id: 'sale3',
    clientId: 'cl3',
    clientName: 'Carlos Eduardo Mendes',
    date: '2025-12-05T16:45:00',
    items: [
      { productId: 'p4', productName: 'Smart Speaker Home', quantity: 2, unitPrice: 499.00 },
      { productId: 'p5', productName: 'Câmera de Segurança 360', quantity: 3, unitPrice: 299.90 },
    ],
    total: 1897.70,
    status: 'completed',
    paymentMethod: 'Boleto',
  },
  {
    id: 'sale4',
    clientId: 'cl1',
    clientName: 'João Silva Santos',
    date: '2025-12-06T09:20:00',
    items: [
      { productId: 'p6', productName: 'Tablet Creator Pro', quantity: 1, unitPrice: 2599.00 },
    ],
    total: 2599.00,
    status: 'pending',
    paymentMethod: 'Cartão de Débito',
  },
  {
    id: 'sale5',
    clientId: 'cl2',
    clientName: 'Maria Oliveira Costa',
    date: '2025-12-07T11:00:00',
    items: [
      { productId: 'p3', productName: 'Fone NoiseCancel 3000', quantity: 2, unitPrice: 1299.50 },
    ],
    total: 2599.00,
    status: 'completed',
    paymentMethod: 'PIX',
  },
];

// ============================================
// ORDENS DE SERVIÇO
// ============================================

export const MOCK_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'os1',
    clientId: 'cl1',
    clientName: 'João Silva Santos',
    equipment: 'Notebook Dell Inspiron 15',
    serialNumber: 'SN123456789',
    issueDescription: 'Notebook não liga, LED de energia acende mas tela permanece preta. Cliente relatou que problema começou após queda.',
    status: 'Em Análise',
    dateIn: '2025-12-01T08:00:00',
    estimatedDateOut: '2025-12-08T18:00:00',
    totalValue: 450.00,
  },
  {
    id: 'os2',
    clientId: 'cl2',
    clientName: 'Maria Oliveira Costa',
    equipment: 'iPhone 13 Pro',
    serialNumber: 'IMEI987654321',
    issueDescription: 'Tela trincada após queda. Touch screen funcionando parcialmente. Necessário troca de display.',
    status: 'Aguardando Peça',
    dateIn: '2025-12-03T10:30:00',
    estimatedDateOut: '2025-12-10T18:00:00',
    totalValue: 1200.00,
  },
  {
    id: 'os3',
    clientId: 'cl3',
    clientName: 'Carlos Eduardo Mendes',
    equipment: 'Smart TV Samsung 55"',
    serialNumber: 'TV55QLED2023',
    issueDescription: 'TV não conecta ao Wi-Fi. Já foi feito reset de fábrica mas problema persiste. Possível problema no módulo wireless.',
    status: 'Aberto',
    dateIn: '2025-12-05T14:00:00',
    estimatedDateOut: '2025-12-12T18:00:00',
    totalValue: 350.00,
  },
  {
    id: 'os4',
    clientId: 'cl1',
    clientName: 'João Silva Santos',
    equipment: 'PlayStation 5',
    serialNumber: 'PS5CFI1234',
    issueDescription: 'Console apresenta erro ao ler discos. Limpeza e ajuste do leitor óptico necessários.',
    status: 'Concluído',
    dateIn: '2025-11-28T09:00:00',
    estimatedDateOut: '2025-12-02T18:00:00',
    totalValue: 280.00,
  },
  {
    id: 'os5',
    clientId: 'cl2',
    clientName: 'Maria Oliveira Costa',
    equipment: 'MacBook Air M2',
    serialNumber: 'MBA2023XYZ',
    issueDescription: 'Bateria não carrega. Adaptador testado e funcionando. Provável problema na porta de carregamento.',
    status: 'Em Análise',
    dateIn: '2025-12-06T11:00:00',
    estimatedDateOut: '2025-12-13T18:00:00',
    totalValue: 650.00,
  },
];

// ============================================
// TEMPLATES DE CONTRATOS
// ============================================

export const MOCK_CONTRACTS: ContractTemplate[] = [
  {
    id: 'ct1',
    title: 'Contrato de Prestação de Serviços de Manutenção',
    content: `
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MANUTENÇÃO</h2>
      
      <p>Por este instrumento particular, de um lado <strong>ECOSISTENS</strong>, inscrita no CNPJ sob nº XX.XXX.XXX/0001-XX, 
      com sede na [Endereço], doravante denominada <strong>CONTRATADA</strong>, e de outro lado:</p>
      
      <p><strong>CONTRATANTE:</strong> [Nome do Cliente]<br>
      <strong>CPF/CNPJ:</strong> [Número]<br>
      <strong>Endereço:</strong> [Endereço Completo]</p>
      
      <h3>CLÁUSULA PRIMEIRA - DO OBJETO</h3>
      <p>O presente contrato tem por objeto a prestação de serviços de manutenção e reparo de equipamentos eletrônicos.</p>
      
      <h3>CLÁUSULA SEGUNDA - DO PRAZO</h3>
      <p>O prazo para execução dos serviços será informado no momento da abertura da ordem de serviço, 
      podendo ser prorrogado em caso de necessidade de peças ou situações imprevistas.</p>
      
      <h3>CLÁUSULA TERCEIRA - DO VALOR E PAGAMENTO</h3>
      <p>O valor dos serviços será informado após diagnóstico técnico e aprovação do cliente. 
      O pagamento deverá ser efetuado na retirada do equipamento.</p>
      
      <h3>CLÁUSULA QUARTA - DA GARANTIA</h3>
      <p>A CONTRATADA oferece garantia de 90 (noventa) dias para os serviços executados e peças substituídas, 
      contados a partir da data de entrega do equipamento.</p>
      
      <h3>CLÁUSULA QUINTA - DAS RESPONSABILIDADES</h3>
      <p>A CONTRATADA não se responsabiliza por dados armazenados nos equipamentos. 
      É de responsabilidade do CONTRATANTE realizar backup de seus dados antes da entrega do equipamento.</p>
      
      <p><br><br>Data: ___/___/______</p>
      <p>_________________________<br>CONTRATANTE</p>
      <p>_________________________<br>CONTRATADA</p>
    `,
    lastModified: '2025-12-01T10:00:00',
  },
  {
    id: 'ct2',
    title: 'Contrato de Compra e Venda',
    content: `
      <h2>CONTRATO DE COMPRA E VENDA</h2>
      
      <p>Por este instrumento particular, de um lado <strong>ECOSISTENS</strong>, inscrita no CNPJ sob nº XX.XXX.XXX/0001-XX, 
      doravante denominada <strong>VENDEDORA</strong>, e de outro lado:</p>
      
      <p><strong>COMPRADOR:</strong> [Nome do Cliente]<br>
      <strong>CPF/CNPJ:</strong> [Número]<br>
      <strong>Endereço:</strong> [Endereço Completo]</p>
      
      <h3>CLÁUSULA PRIMEIRA - DO OBJETO</h3>
      <p>A VENDEDORA vende ao COMPRADOR os produtos discriminados na nota fiscal anexa a este contrato.</p>
      
      <h3>CLÁUSULA SEGUNDA - DO PREÇO E PAGAMENTO</h3>
      <p>O preço total da compra é de R$ [Valor], a ser pago conforme condições acordadas na nota fiscal.</p>
      
      <h3>CLÁUSULA TERCEIRA - DA GARANTIA</h3>
      <p>Os produtos vendidos possuem garantia do fabricante conforme especificado em cada item, 
      além da garantia legal de 90 dias prevista no Código de Defesa do Consumidor.</p>
      
      <h3>CLÁUSULA QUARTA - DA ENTREGA</h3>
      <p>A entrega dos produtos será realizada no endereço informado pelo COMPRADOR, 
      no prazo de até [X] dias úteis após a confirmação do pagamento.</p>
      
      <h3>CLÁUSULA QUINTA - DO DIREITO DE ARREPENDIMENTO</h3>
      <p>O COMPRADOR poderá desistir da compra no prazo de 7 (sete) dias a contar do recebimento do produto, 
      conforme previsto no Art. 49 do CDC.</p>
      
      <p><br><br>Data: ___/___/______</p>
      <p>_________________________<br>COMPRADOR</p>
      <p>_________________________<br>VENDEDORA</p>
    `,
    lastModified: '2025-12-01T10:00:00',
  },
];
