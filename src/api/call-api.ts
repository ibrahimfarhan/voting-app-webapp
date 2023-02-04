const callApi = async (path: string, reqOptions?: RequestInit) => {
  try {
    const response = await fetch(path, stdRequestOptions(reqOptions || {}));
    const resBody = await getResponseBody(response);

    if (!response.ok) {
      return Promise.reject(resBody);
    }

    return Promise.resolve(resBody);
  }

  catch (e) {
    return Promise.reject(e);
  }
};

const stdRequestOptions = (reqOptions: RequestInit): RequestInit => Object.assign(
  {
    headers: { 'content-type': 'application/json' },
    credentials: 'include'
  },
  reqOptions
);

export function getResponseBody (response: Response): Promise<any> {
  if (response.status === 204) return Promise.resolve();
  const contentType = response.headers.get('content-type');
  if (contentType === 'application/json') return response.json();
  if (contentType === 'plain/text') return response.text();
  return Promise.reject('Error while reading server response');
}

export default callApi;