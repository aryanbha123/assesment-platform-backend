// index.ts or server.ts
import { db } from "../config/config.js";
import AssesmentSolution from "../models/Solution.js";
import User from "../models/User.js";
import cron from "node-cron";
import { sendAssessmentThankYouMail } from "./sendMail.js";

export const startEvaluatedUsersCron = () => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      // 1️⃣ Fetch evaluated & non-notified solutions
      const solutions = await AssesmentSolution.find({
        isEvaluated: true,
        $or: [{ notified: false }, { notified: { $exists: false } }],
      }).select("userId");

      if (!solutions.length) {
        console.log("No evaluated users found");
        return;
      }

      // 2️⃣ Extract userIds
      const userIds = solutions.map((s) => s.userId).filter(Boolean);

      // 3️⃣ Fetch users using $in
      const users = await User.find({
        _id: { $in: userIds },
      }).select("name email");

      // 4️⃣ Create a fast lookup map
      const userMap = new Map(users.map((u) => [u._id.toString(), u]));

      // 5️⃣ Send mails
      for (const solution of solutions) {
        const user = userMap.get(solution.userId.toString());
        if (!user) continue;

        await sendAssessmentThankYouMail({
          name: user.name,
          email: user.email,
          assessmentId: solution._id,
        });

        console.log("Evaluated user:", user.name, user.email);
      }

      // 6️⃣ Mark all as notified
      await AssesmentSolution.updateMany(
        { _id: { $in: solutions.map((s) => s._id) } },
        { $set: { notified: true } },
      );
      console.log("MARKED ALL NOTIFUED")
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  console.log("Evaluated users cron started (every 10s)");
};

(async () => {
  await db();
  startEvaluatedUsersCron();
})();
