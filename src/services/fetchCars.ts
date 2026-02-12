import { supabase } from "../../lib/supabase";
export async function fetchCars() {
  const { data, error } = await supabase
    .from("cars")
    .select(`
      id,
      make,
      model,
      year,
      color,
      fuel_type,
      transmission,
      seats,
      city,
      province,
      car_pricing (
        price_per_day,
        price_per_week,
        price_per_month
      ),
      car_images (
        image_url,
        is_thumbnail
      ),
      users!owner_id(
        name,
        id
      )
    `)
    .eq("availability_status", "available");

  if (error) throw error;
  return data;
}
