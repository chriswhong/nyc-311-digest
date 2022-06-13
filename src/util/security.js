
let getAccessToken

export const sec = {
  getAccessToken: () => getAccessToken,
  setAccessToken: (func) =>
    (getAccessToken = func)
}
