import { ApiClient } from "../utils/apiClient";
import { SportsInfoResponse } from "../utils/types";
import dotenv from "dotenv";

dotenv.config();

const baseURL = process.env.API_BASE_URL!;
const sportsInfoEndpoint = process.env.API_SPORTS_INFO_URL!;

export async function verifyAndCreateSportsInfo(): Promise<SportsInfoResponse | null> {
  const apiClient = new ApiClient(baseURL);
  await apiClient.init();

  const getResponse = await apiClient.get(sportsInfoEndpoint, true);
  if (getResponse.status() === 200) {
    const body = (await getResponse.json()) as SportsInfoResponse;
    if (body.data?.sportsInfos?.length > 0) {
      return body;
    }
  }

  console.warn("No sports info found. Attempting to create 'CrossFit' via POST...");
  const payload = { name: `CrossFit-${Math.random().toString(36).substring(2, 8)}` };

  let createResponse = await apiClient.post(sportsInfoEndpoint, payload, true);

  if ([200, 201].includes(createResponse.status())) {
    console.log("Created 'CrossFit' via POST successfully.");
    return (await createResponse.json()) as SportsInfoResponse;
  }

  if ([400, 404].includes(createResponse.status())) {
    console.warn(`POST failed (${createResponse.status()}), retrying with PATCH...`);
    createResponse = await apiClient.patch(sportsInfoEndpoint, payload, true);

    if ([200, 201].includes(createResponse.status())) {
      console.log("Created 'CrossFit' via PATCH successfully.");
      return (await createResponse.json()) as SportsInfoResponse;
    }
  }

  const errText = await createResponse.text();
  console.error(`Failed to create sports info: ${createResponse.status()} - ${errText}`);
  return null;
}
