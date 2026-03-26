//http://api.weatherapi.com/v1/current.json?key=e715f0b84eeb48fbb9873437262603&q=Mumbai&aqi=no
const tempfield=document.querySelector(".tempretur span")
const locationfield=document.querySelector(".location_time p");
const datefield=document.querySelector(".location_time span");
const wheaterfield=document.querySelector(".condition p");
const searchField=document.querySelector(".search_area");
const form=document.querySelector("form");
const reset=document.querySelector("#resetbtn");

const fetchResult=async(targetlogacation)=>{
    let url=`http://api.weatherapi.com/v1/current.json?key=e715f0b84eeb48fbb9873437262603&q=${targetlogacation}&aqi=no`;

    const res=await fetch(url);

    const data= await res.json();
    console.log(data);
       if (data.error) {
        tempfield.innerText = "--";
        locationfield.innerText = "Invalid City ❌";
        datefield.innerText = "Please enter correct city name";
        wheaterfield.innerText = "";
        return;
    }

    let locationName=data.location.name;
    let time=data.location.localtime;
    let temp=data.current.temp_c;
    let condition=data.current.condition.text;
    updateDetails(locationName,time,temp,condition)
}
form.addEventListener("submit", searchForLocation)

function searchForLocation(e){
    e.preventDefault();
   let target=searchField.value
    fetchResult(target);
}
function updateDetails(locationName, time, temp, condition){

    let splitDate = time.split(" ")[0]
    let splitTime = time.split(" ")[1]

    let currentDay = getDayName(new Date(splitDate).getDay())

    tempfield.innerText = temp;
    locationfield.innerText = locationName;
    datefield.innerText = `${splitDate} ${currentDay} ${splitTime}`;
    wheaterfield.innerText = condition;
}
reset.addEventListener("click",resetAll);
function resetAll(){

    tempfield.innerText = "--";
    locationfield.innerText = "City";
    datefield.innerText = "Time - Day Date";
    wheaterfield.innerText = "Condition";
    searchField.value = "";

}
function getDayName(number){
    switch(number){
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
    }
}

