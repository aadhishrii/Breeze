export const getUserItineraries = async (eventId) => {
    const apiResult = await fetch(`http://127.0.0.1:8000/getUserItineraries?id=${eventId}`)
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    console.log("user itineraries:", apiResult)
    return apiResult
}
  
export const getUserEvents = async (eventId) => {
    const apiResult = await fetch(`http://127.0.0.1:8000/getUserEvents?id=${eventId}`)
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    console.log("user events:", apiResult)
    return apiResult
}
  
export const getProfileData = async (email) => {
    const apiResult = await fetch(`http://127.0.0.1:8000/getProfileData?email=${email}`)
    .then(response => response.json())
    .catch(err => {
      console.log("err: ", err);
    })
    return apiResult
}

export const makeRiskAssessment = (eventData, ratio) => {
  console.log("ratio A: ", ratio);
  let percentage = ratio;
  // if indoors, the chances of getting covid doubles
  if(eventData.exposure == 'Indoor'){
    percentage = percentage * 2;
  }
  // if indooes and outdoors, the changes increase by 1.5
  else if(eventData.exposure == 'Both'){
    percentage = percentage * 1.5;
  }
  // public, chances increase by 1.2 -> based on parsed statistical data: linear regression or some shit

  if(eventData.venueType == 'Public'){
    percentage = percentage * 0.8;
  }else if(eventData.venueType == 'Business'){
    percentage = percentage * 1.25;
  }else if(eventData.venueType == 'Household'){
    percentage = percentage * 1.25;
  }
  // increases as the capacity goes up
  if(eventData.capacity < 10){
    percentage = percentage * 1.0;
  } else if(eventData.capacity >= 10 && eventData.capacity < 100) {
    percentage = percentage * 1.2;
  } else if(eventData.capacity >= 100 && eventData.capacity <= 500) {
    percentage = percentage * 1.3;
  } else {
    percentage = percentage * 1.4;
  }

  if(percentage > 1){
    percentage = 0.99;
  }

  return percentage;
}


export const calculateRiskLevel = (riskPercentage) => {
  if(riskPercentage > 0 && riskPercentage < 33){
    return ["success", "Low"];
  }else if(riskPercentage >= 33 && riskPercentage < 66){
    return ["warning", "Moderate"];
  }else if(riskPercentage >=66 && riskPercentage < 100){
    return ['danger', "High risk"];
  }
}