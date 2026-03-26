import { supabase } from '../../lib/supabase'

export async function resetPassword(email, password) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "automate://reset-password",
  });

  if (error) {
  } else {
    updatePassword(password)
  }
};

const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
supabase.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") {
  }
});
  if (error) {
  }
};

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
    } else {
      return data
    }
  } catch {
    console.error('Failed fetching user info:')
  }
}

export async function fetchCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(
      `
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
    `,
    )
    .eq('availability_status', 'available')

  if (error) throw error
  return data
}

export async function addBooking(requestedBooking: {
  car_id: string
  renter_id: string
  start_date: string
  end_date: string
  total_price: number
  initial_price: number
  status?: string
}) {
  // set default status if not provided
  const bookingToInsert = {
    ...requestedBooking,
    status: requestedBooking.status || 'pending',
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingToInsert])
    .select()

  if (error) {
    console.error('Error adding booking', error.message)
    return null
  }

  return data
}

export async function fetchBookings() {
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
      .from('bookings')
      .select(
        `*, 
                      cars(id, make, model, year, city, fuel_type, transmission, seats, car_images(image_url, is_thumbnail),
                      car_pricing (
                        price_per_day,
                        price_per_week,
                        price_per_month),
                      users!owner_id(name, id))`,
      )
      .eq('renter_id', user.id)
      .order('start_date', { ascending: false })

    if (error) {
      console.error('Error fetching booking:', error.message)
    } else {
      return data
    }
  } catch {
    console.error('Failed fetching boookings:')
  }
}
export async function fetchPendingBookings() {
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
      .from('bookings')
      .select(
        `*, 
                      cars(id, make, model, year, city, fuel_type, transmission, seats, car_images(image_url, is_thumbnail),
                      car_pricing (
                        price_per_day,
                        price_per_week,
                        price_per_month),
                      users!owner_id(name, id))`,
      )
      .eq('renter_id', user.id)
      .order('start_date', { ascending: false })
      .eq('status', 'pending')

    if (error) {
      console.error('Error fetching pending booking:', error.message)
    } else {
      return data
    }
  } catch {
    console.error('Failed fetching pending boookings:')
  }
}
export async function fetchUpcomingBookings() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0) 

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await supabase
      .from('bookings')
      .select(
        `*, 
                      cars(id, make, model, year, city, fuel_type, transmission, seats, car_images(image_url, is_thumbnail),
                      car_pricing (
                        price_per_day,
                        price_per_week,
                        price_per_month),
                      users!owner_id(name, id))`,
      )
      .eq('renter_id', user.id)
      .eq('status', 'approved')
      .or(
        `start_date.lt.${today.toISOString()},start_date.gte.${tomorrow.toISOString()}`
    )


    if (error) {
      console.error('Error fetching upcoming booking:', error.message)
    } else {
      return data
    }
  } catch (error){
    console.error('Failed fetching upcoming boookings:', error)
  }
}
export async function fetchActiveBookings() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('bookings')
      .select(
        `*, 
                      cars(id, make, model, year, city, fuel_type, transmission, seats, car_images(image_url, is_thumbnail),
                      car_pricing (
                        price_per_day,
                        price_per_week,
                        price_per_month),
                      users!owner_id(name, id))`,
      )
      .eq('renter_id', user.id)
       .eq('status', 'approved')
  .lte('start_date', now)
  .gte('end_date', now)


    if (error) {
      console.error('Error fetching upcoming booking:', error.message)
    } else {
      return data
    }
  } catch (error){
    console.error('Failed fetching upcoming boookings:', error)
  }
}
export async function fetchOwnedCars() {
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
      .from('cars')
      .select(
        `
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
    `,
      )
      .eq('owner_id', user.id)

    if (error) throw error
    return data
  } catch (error) {
    return
  }
}

export async function fetchActiveCars() {
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
      .from('cars')
      .select(
        `
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
    `,
      )
      .eq('owner_id', user.id)
      .eq('isApprovedByAdmin', true)

    if (error) throw error
    return data
  } catch (error) {
    return
  }
}

export async function addCar(newCar: {
  make: string
  model: string
  year: string
  color: string
  plate_number: string
  category: string
  transmission: string
  fuel_type: string
  seats: number
  city: string
  province: string
  pickup_location: string
  latitude: number
  longitude: number
}) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Add user_id to the object
  const carWithUser = {
    ...newCar,
    owner_id: user.id,
  }

  const { data, error } = await supabase
    .from('cars')
    .insert([carWithUser])
    .select()

  if (error) {
    console.error('Error adding cars ', error.message)
    return null
  }

  return data
}

const uriToBlob = async (uri) => {
  const response = await fetch(uri)
  const blob = await response.blob()
  return blob
}

export async function uploadCarImage(imageUri) {
  const user = (await supabase.auth.getUser()).data.user

  if (!user) throw new Error('User not logged in')

  // Convert file:// → binary
  const response = await fetch(imageUri)
  const arrayBuffer = await response.arrayBuffer()

  const fileName = `${Date.now()}.jpeg`
  const filePath = `${user.id}/${fileName}`

  const { data, error } = await supabase.storage
    .from('car_images')
    .upload(filePath, arrayBuffer, {
      contentType: 'image/jpeg',
    })

  if (error) {
    throw error
  }

  return data
}
export async function addCarImage(newImage: {
  car_id: string
  image_url: string
}) {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error } = await supabase.from('car_images').insert([newImage])

    if (error) {
      console.error('Error adding car image ', error.message)
      return null
    }

    return data
  } catch (error) {
    return
  }
}

export function getPublicUrl(path) {
  const { data } = supabase.storage.from('car_images').getPublicUrl(path)

  return data.publicUrl
}

export async function fetchCarDetailsById(car_id) {
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
      .from('cars')
      .select(
        `
        id,
        make,
        model,
        year,
        color,
        fuel_type,
        transmission,
        plate_number,
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
        users!owner_id (
          name,
          id
        )
      `,
      )
      .eq('id', car_id)
      .single() // optional but recommended if fetching one car

    if (error) throw error
    return data
  } catch (error) {
    return
  }
}
export async function updateCarDetails(
  carId: string,
  location: {
    city: string
    province: string
    pickup_location: string
    latitude: string
    longitude: string
  }
) {
  const { data, error } = await supabase
    .from('cars')
    .update({
      city: location.city,
      province: location.province,
      pickup_location: location.pickup_location,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .eq('id', carId)
    .select()
    .single() // ensures one row

  if (error) {
    throw error
  }

  return data
}
export async function addCarPricing(car_price:{
  price_per_day: number,
  price_per_week: number,
  price_per_month: number,
  with_driver: boolean,
  with_driver_price_per_day: number
}) {

   try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error } = await supabase.from('car_pricing').insert([car_price])

    if (error) {
      console.error('Error adding car pricing ', error.message)
      return null
    }

    return data
  } catch (error) {
    return
  }
}
export async function checkIfCarOwned(carId){
  try{
       const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error} = await supabase.from('cars').select('owner_id').eq('id', carId).single()

    if (data?.owner_id === user.id){
      return true
    }

    if (error){
      return false
    }

    return false

  }catch (error){
    return
  }
}

export async function fetchOwnerBookingsByCar(
  carId: string,
  status?: string,
) {
  try {
    let query = supabase
      .from('bookings')
      .select(
        `
        id,
        car_id,
        renter_id,
        start_date,
        end_date,
        total_price,
        initial_price,
        status,
      users!renter_id (
  id,
  name,
  city,
  profile_image
)
      `,
      )
      .eq('car_id', carId)
      .order('start_date', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching owner bookings:', error.message)
      return []
    }

    return data || []
  } catch (error) {
    return []
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Error updating booking status:', error.message)
      return null
    }

    return data
  } catch (error) {
    return null
  }
}
