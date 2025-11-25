import { ApiClient } from "../utils/apiClient";
import { HealthInfoFactory } from "../utils/healthDataFactory";


export const verifyAndCreateHealthInfo = async () => {
const userBiologicalSex = process.env.API_BIOLOGICAL_SEX!;
  const api = new ApiClient(process.env.API_BASE_URL!);
  await api.init();

  const payload = HealthInfoFactory.valid(userBiologicalSex);
  await api.patch(process.env.API_HEALTH_INFO_URL!, payload, true);
  await api.dispose();
};
