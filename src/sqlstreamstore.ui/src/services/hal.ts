import { createClient, HalRestClient  } from "hal-rest-client";

let halClient: HalRestClient;

export const createHalClient = (basename: string | null) => {
  halClient = createClient(basename + 'hal');
};

export const getHalClient = (): HalRestClient => {
  return halClient;
};
