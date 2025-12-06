
export interface Brand {
  id: string;
  name: string;
  logo: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  images: string[]; // Array of 4 image URLs
  rating: number;
  reviews: number;
  stock: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FilterState {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
}

// Admin Types

export interface Address {
  zipCode: string;
  street: string;
  complement?: string;
  district: string;
  city: string;
  state?: string;
  number?: string;
  label?: string; // e.g. "Principal", "Entrega", "Cobrança"
}

export interface AdminClient {
  id: string;
  name: string;
  contact: string;
  email: string;
  rg: string;
  cpf: string;
  addresses: Address[]; // Changed from single address to array
}

export interface AdminSupplier {
  id: string;
  corporateName: string; // Razão Social
  name: string; // Nome Fantasia
  contact: string;
  email: string;
  cnpj: string;
  stateRegistration: string; // Inscrição
  addresses: Address[]; // Changed from single address to array
  sellerName: string;
  sellerContact: string;
  sellerEmail: string;
}

export interface AdminProduct extends Product {
  barcode: string;
  ncm: string;
  unit: string;
  model: string;
  purchasePrice: number;
  margin: number;
  retailPrice: number; // Preço Venda Varejo
  wholesalePrice: number; // Preço Venda Atacado
  serialNumber: string;
  supplierId: string;
  showInStore: boolean; // Sim/Não
  storeDescription: string;
}

export interface AdminService {
  id: string;
  barcode: string;
  description: string;
  ncm: string;
  categoryId: string;
  subCategoryId: string;
  unit: string;
  costPrice: number;
  margin: number;
  retailPrice: number;
  wholesalePrice: number;
  serialNumber?: string;
  supplierId?: string;
  quantity: number;
  showInStore: boolean;
  storeDescription: string;
}

export interface AdminUser {
  id: string;
  name: string;
  contact: string;
  email: string;
  rg: string;
  cpf: string;
  address: Address;
}

export interface AdminCollaborator {
  id: string;
  corporateNameOrName: string;
  contact: string;
  email: string;
  cnpjOrCpf: string;
  inscriptionOrRg?: string;
  address: Address;
  sellerName?: string;
  sellerContact?: string;
  sellerEmail?: string;
}

// Checklist Types
export type ChecklistItemType = 'checkbox' | 'text' | 'photo' | 'file';

export interface ChecklistItem {
  id: string;
  label: string;
  type: ChecklistItemType;
  required: boolean;
  instructions?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  relatedServiceId?: string; // Optional link to a specific service
  items: ChecklistItem[];
  createdAt: string;
}

// Service Order Type
export interface ServiceOrder {
  id: string;
  clientId: string;
  clientName: string;
  equipment: string;
  serialNumber?: string;
  issueDescription: string;
  status: 'Aberto' | 'Em Análise' | 'Aguardando Peça' | 'Concluído' | 'Cancelado';
  checklistTemplateId?: string; // Link to the checklist used
  checklistTemplateName?: string;
  dateIn: string;
  estimatedDateOut?: string;
  totalValue?: number;
}

// Contract Types
export interface ContractTemplate {
  id: string;
  title: string;
  content: string; // HTML content
  lastModified: string;
}