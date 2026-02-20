import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { modelName } = await req.json();

  return new Response(
    JSON.stringify({
      make: "Mitsubishi",
      model: modelName,
      year: 2023,
      transmission: "Automatic",
      fuel_type: "Gasoline",
      seats: 7,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});
