import { createClient, HalRestClient  } from "hal-rest-client";

let halClient: HalRestClient;

export const createHalClient = (basename: string | null) => {
  console.log(basename);
  halClient = createClient('/', {
    validateStatus: function (status) {
      if (status === 404 || (status >= 200 && status < 300)) {
        return true;
      }
      return false;
    },
  });

  halClient.interceptors.request.use(options => {
    console.log('original HAL request: ' + options.url);
    var anchor = document.createElement('a');
    let url =  options.url || '/';
    url = url.replace(/\.\.\//g, '');
    anchor.href = url;
    options.url = anchor.origin + basename + 'hal' + url;
    console.log('rewritten HAL request: ' + options.url)
    return options;
  });
};

export const getHalClient = (): HalRestClient => {
  return halClient;
};
