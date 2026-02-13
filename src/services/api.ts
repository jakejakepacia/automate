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