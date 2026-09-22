import { logActivity } from "@/features/activity/server/activity.actions";

type LogActivityParams = Parameters<typeof logActivity>[0];

export async function safeLogActivity(params: LogActivityParams) {
  try {
    await logActivity(params);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}
