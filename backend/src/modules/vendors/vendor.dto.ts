export interface CreateVendorDTO {
  businessName: string;

  description?: string;

  experience?: number;

  city: string;
  state: string;
  country: string;

  minPrice: number;
  maxPrice: number;

  phone?: string;

  website?: string;
}