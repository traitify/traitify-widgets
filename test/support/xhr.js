export const xdrMocks = {
  open: jest.fn().mockName("xdrOpen"),
  send: jest.fn().mockName("xdrSend")
};
export const xhrMocks = {
  open: jest.fn().mockName("xhrOpen"),
  send: jest.fn().mockName("xhrSend"),
  setRequestHeader: jest.fn().mockName("xhrSetRequestHeader")
};
export const XDomainRequestMock = jest.fn().mockImplementation(()=>({...xdrMocks}));
export const XMLHttpRequestMock = jest.fn().mockImplementation(()=>({...xhrMocks}));
