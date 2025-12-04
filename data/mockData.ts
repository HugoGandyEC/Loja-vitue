import { Brand, Category, Product } from '../types';

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
