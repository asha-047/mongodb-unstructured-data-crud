const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://127.0.0.1:27017"; // or use MongoDB Atlas URL
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("elearningDB");
    const activityLogs = db.collection("activityLogs");
    const mediaMetadata = db.collection("mediaMetadata");

    // 1. Insert Documents
    await activityLogs.insertMany([
      { userId: "U001", activity: "Watched Video", videoId: "V100", timestamp: new Date() },
      { userId: "U002", activity: "Posted in Chat", message: "Hello everyone!", timestamp: new Date() }
    ]);

    await mediaMetadata.insertOne({
      videoId: "V100",
      tags: ["Machine Learning", "Lecture 1"],
      thumbnail: "thumb_v100.jpg"
    });

    console.log("✅ Inserted sample data");

    // 2. Read Documents
    const activities = await activityLogs.find().toArray();
    console.log("📌 Activity Logs:", activities);

    // 3. Update Document
    await activityLogs.updateOne(
      { userId: "U002" },
      { $set: { message: "Hello team, excited to learn!" } }
    );
    console.log("✅ Updated activity log");

    // 4. Delete Document
    await activityLogs.deleteOne({ userId: "U001" });
    console.log("❌ Deleted one log");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
