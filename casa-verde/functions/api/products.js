export async function onRequestGet({ env }) {
  try {
    const products = await env.CASA_VERDE_KV.get("products", {
      type: "json"
    });

    return Response.json(products || []);
  } catch (error) {
    console.error("KV products error:", error);

    return Response.json(
      {
        error: "Failed to load products"
      },
      {
        status: 500
      }
    );
  }
}
