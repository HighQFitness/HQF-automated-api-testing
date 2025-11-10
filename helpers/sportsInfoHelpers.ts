import { ApiClient } from "../utils/apiClient";
import { SportsInfoResponse } from "../utils/types";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const sportsInfoEndpoint = process.env.API_SPORTS_INFO_URL!;

/**
 * Ensures at least one sports info exists for the current account.
 * - Uses GET to check
 * - If none found, tries POST to create one
 * - If POST fails with 400/404, retries PATCH fallback
 */
export async function verifyAndCreateSportsInfo(): Promise<SportsInfoResponse | null> {
  const apiClient = new ApiClient(baseURL);
  await apiClient.init();

  // Step 1️⃣: Check if sports info already exists
  const getResponse = await apiClient.get(sportsInfoEndpoint, true);
  if (getResponse.status() === 200) {
    const body = (await getResponse.json()) as SportsInfoResponse;
    if (body.data?.sportsInfos?.length > 0) {
      console.log("✅ Sports info already exists.");
      return body;
    }
  }

  console.warn("⚙️ No sports info found. Attempting to create 'CrossFit' via POST...");
  const payload = { name: `CrossFit-${Math.random().toString(36).substring(2, 8)}` };

  // Step 2️⃣: Try POST first (preferred)
  let createResponse = await apiClient.post(sportsInfoEndpoint, payload, true);

  if ([200, 201].includes(createResponse.status())) {
    console.log("✅ Created 'CrossFit' via POST successfully.");
    return (await createResponse.json()) as SportsInfoResponse;
  }

  // Step 3️⃣: If POST fails, try PATCH as fallback
  if ([400, 404].includes(createResponse.status())) {
    console.warn(`⚠️ POST failed (${createResponse.status()}), retrying with PATCH...`);
    createResponse = await apiClient.patch(sportsInfoEndpoint, payload, true);

    if ([200, 201].includes(createResponse.status())) {
      console.log("✅ Created 'CrossFit' via PATCH successfully.");
      return (await createResponse.json()) as SportsInfoResponse;
    }
  }

  // Step 4️⃣: Log detailed failure
  const errText = await createResponse.text();
  console.error(`❌ Failed to create sports info: ${createResponse.status()} - ${errText}`);
  return null;
}
