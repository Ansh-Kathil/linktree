import Link from "next/link";
import clientPromise from "@/lib/mongodb";

const Stats = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("bittree");
    const collection = db.collection("links");

    // Total users
    const count = await collection.countDocuments();

    // Total profile visits
    const totalVisitsResult = await collection.aggregate([
      { $group: { _id: null, total: { $sum: "$visits" } } }
    ]).toArray();
    const totalVisits = totalVisitsResult?.[0]?.total || 0;

    // Total links created
    const totalLinksResult = await collection.aggregate([
      { $project: { linkCount: { $size: "$links" } } },
      { $group: { _id: null, total: { $sum: "$linkCount" } } }
    ]).toArray();
    const totalLinks = totalLinksResult?.[0]?.total || 0;

    // Top 5 most visited
    const fetchUser = await collection.find({}).sort({ visits: -1 }).limit(5).toArray();

    return (
      <div className="bg-[#F0F2BD] grid grid-cols-2 items-center min-h-screen">
        <div className="boxes mt-10 flex-col flex justify-center items-center gap-5 ml-[10vw]">
          <div className="box bg-[#B2CD9C] border p-4 rounded-lg text-center mx-10">
            <p className="font-bold">👤 Registered Users: {count}</p>
            <span>
              Over {count} amazing creators have joined Bittree!
              Each one has crafted their own personalized profile to share links, showcase passions, and connect with the world — all from a single place.
            </span>
          </div>

          <div className="box mx-10 bg-[#B2CD9C] border p-4 rounded-lg text-center">
            <p className="font-bold">👀 Total Profile Visits: {totalVisits}</p>
            <span>
              Bittree profiles have been viewed over {totalVisits} times!
              People around the globe are discovering new creators, exploring their content, and clicking through their world — one visit at a time.
            </span>
          </div>

          <div className="box mx-10 bg-[#B2CD9C] border p-4 rounded-lg text-center">
            <p className="font-bold">🔗 Links Created: {totalLinks}</p>
            <span>
              More than {totalLinks} unique links have been created on Bittree!
              From social handles to portfolios and beyond, creators are connecting everything that matters in one sleek profile.
            </span>
          </div>
        </div>

        <div className="mt-10 ml-20 mr-10 p-3 w-fit flex-col border flex bg-[#B2CD9C] rounded-lg">
          <h2 className="font-bold text-2xl my-2">Top 5 Most Visited Profiles</h2>
          {fetchUser.map((user, i) => (
            <li key={i} className="my-2 ml-3 flex gap-2 bg-[#d8dcb7] p-1 border rounded-full items-center">
              <img className="rounded-full" width={33} src={user.pic} alt="user avatar" />
              <p>
                <span className="font-bold">@{user.handle}</span> has
                <span className="font-bold"> {user.visits}</span> visits.
                <Link href={`/${user.handle}`}>
                  <span className="font-bold text-blue-900 cursor-pointer ml-1">Click</span>
                </Link> to view.
              </p>
            </li>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Stats Page Error:", error);

    return (
      <div className="bg-[#F0F2BD] flex items-center justify-center min-h-screen p-4">
        <div className="bg-[#B2CD9C] border p-8 rounded-lg text-center max-w-md">
          <h2 className="font-bold text-2xl mb-4">Stats Temporarily Unavailable</h2>
          <p className="mb-4">
            We are experiencing some technical difficulties. Please try again later.
          </p>
          <Link href="/" className="font-bold text-blue-900 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
};

export default Stats;
