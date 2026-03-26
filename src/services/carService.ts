import { Car } from '../types/car';
import { supabase } from '../../lib/supabase'

export async function fetchOwnedCars(): Promise<Car[] | undefined> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('No authenticated user');
      return;
    }

    const { data, error } = await supabase
      .from('cars')
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
        isApprovedByAdmin,
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
      .eq('owner_id', user.id);

    if (error) throw error;

    return data as Car[];
  } catch (error) {
    return;
  }
}
