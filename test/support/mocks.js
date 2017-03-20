import RequestMock from "./request-mock";
import Factories from "./factories";

RequestMock.addMock("slides", (options)=>{
  if (options.path.indexOf("slides") != -1){
    return {slides: Factories.Data.Slides()};
  }
});

RequestMock.addMock("results", (options)=>{
  if (options.path.indexOf("results") != -1){
    return Factories.Data.Assessment().results();
  }
});

export default RequestMock;