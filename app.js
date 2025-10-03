// app.js
const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://127.0.0.1:27017"; // local MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    // Step 1: Create DB and Collections
    const db = client.db("elearningDB");
    const activityLogs = db.collection("activityLogs");
    const mediaMetadata = db.collection("mediaMetadata");

    // Step 2: Insert Documents
    await activityLogs.insertMany([
      { userId: "U001", activity: "Watched Video", videoId: "V100", timestamp: new Date() },
      { userId: "U002", activity: "Posted in Chat", message: "Hello everyone!", timestamp: new Date() }
    ]);

    await mediaMetadata.insertOne({
      videoId: "V100",
      tags: ["Machine Learning", "Lecture 1"],
      thumbnail: "thumb_v100.jpg"
    });

    console.log("✅ Inserted sample documents");

    // Step 3: Read Data
    const logs = await activityLogs.find().toArray();
    console.log("📌 Activity Logs:", logs);

    const recentLogs = await activityLogs.find({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).toArray();
    console.log("📌 Recent Activities:", recentLogs);

    // Step 4: Update Data
    await activityLogs.updateOne(
      { userId: "U002" },
      { $set: { message: "Hello team, excited to learn!" } }
    );
    console.log("✅ Updated log for U002");

    // Step 5: Delete Data
    await activityLogs.deleteOne({ userId: "U001" });
    console.log("❌ Deleted log for U001");

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
