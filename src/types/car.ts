export type CarPricing = {
  price_per_day: number | null;
  price_per_week: number | null;
  price_per_month: number | null;
};

export type CarImage = {
  image_url: string;
  is_thumbnail: boolean;
};

export type CarOwner = {
  id: string;
  name: string;
};

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuel_type: string;
  transmission: string;
  seats: number;
  city: string;
  province: string;
  isApprovedByAdmin: boolean;

  // relations (arrays in Supabase)
  car_pricing: CarPricing[];
  car_images: CarImage[];

  users: CarOwner; // from users!owner_id
};