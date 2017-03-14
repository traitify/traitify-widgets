import RequestMock from "./request-mock";
import Factories from "./factories";

RequestMock.addMock("slides", (options)=>{
  return (cb)=>{
    return cb({slides: Factories.Data.Slides()});
  };
});

RequestMock.addMock("results", (options)=>{
  return (cb)=>{
    return cb({personality_types: [], slides: []});
  };
});

export default RequestMock;