import Factories from "./factories";

function Mock(item){
  item.get = (path, params)=>{
    return new Promise((resolve, reject)=>{
      if(path.indexOf("/assessments/slidedeck") !== -1){
        resolve({slides: Factories.Data.Slides()});
      }else if(path.indexOf("/assessments/results") !== -1){
        resolve(Factories.Data.Assessment().results());
      }
    });
  };
}

export default Mock;
