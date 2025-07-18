import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.handle || !Array.isArray(body.links) || !body.pic) {
      return Response.json({
        success: false,
        error: true,
        message: "Missing required fields",
        result: null,
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const collection = db.collection("links");

    const doc = await collection.findOne({ handle: body.handle });

    if (doc) {
      return Response.json({
        success: false,
        error: true,
        message: "This Handle already exists",
        result: null,
      });
    }

    const result = await collection.insertOne(body);
    return Response.json({
      success: true,
      error: false,
      message: "Your Bittree has been generated",
      result: result,
    });
  } catch (err) {
    console.error("API /generate Error:", err.message, err.stack);
    return Response.json(
      {
        success: false,
        error: true,
        message: "Internal server error",
        result: null,
      },
      { status: 500 }
    );
  }
}
