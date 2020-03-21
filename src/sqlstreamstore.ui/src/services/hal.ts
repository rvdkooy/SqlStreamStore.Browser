import { createClient, HalRestClient  } from "hal-rest-client";

let halClient: HalRestClient;

export const createHalClient = (basename: string | null) => {
  halClient = createClient(basename + 'hal', {
    validateStatus: function (status) {
      if (status === 404 || (status >= 200 && status < 300)) {
        return true;
      }
      return false;
    },
  });
};

export const getHalClient = (): HalRestClient => {
  return halClient;
};
