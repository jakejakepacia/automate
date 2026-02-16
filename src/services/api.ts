import { supabase } from '../../lib/supabase'
export async function fetchUserInfo() {
  try {

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user info:', error.message)
    }else{
        return data
    }
  }catch{
    console.error('Failed fetching user info:')
  }
}

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

export async function addBooking(requestedBooking: {
    car_id: string;
    renter_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    initial_price: number;
    status?: string ;
}) {

     // set default status if not provided
  const bookingToInsert = {
    ...requestedBooking,
    status: requestedBooking.status || "pending",
  };

  console.log(bookingToInsert)
  console.log("yting")

    const { data, error} = await supabase.from("bookings").insert([bookingToInsert]).select();

    if (error){
        console.error("Error adding booking", error.message);
        return null;
    }

    return data;
}

export async function fetchBookings(){
   try {

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error } = await supabase
                    .from("bookings")
                    .select(
                        `*, 
                      cars(id, make, model, year, city, fuel_type, transmission, seats, car_images(image_url, is_thumbnail),
                      car_pricing (
                        price_per_day,
                        price_per_week,
                        price_per_month),
                      users!owner_id(name, id))`
                    )
                    .eq("renter_id", user.id)
                    .order("start_date", { ascending: false });

    if (error) {
      console.error('Error fetching booking:', error.message)
    }else{
        return data
    }
  }catch{
    console.error('Failed fetching boookings:')
  }
}
export async function fetchOwnedCars() {

  try{

const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

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
    .eq("owner_id", user.id);

  if (error) throw error;
  return data;
  }catch (error){
    console.log("fetch owned car error")
  }
   
}