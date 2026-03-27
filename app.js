//https://api.weatherapi.com/v1/current.json?key=e715f0b84eeb48fbb9873437262603&q=Mumbai&aqi=no

const tempfield=document.querySelector(".tempretur span")
const locationfield=document.querySelector(".location_time p");
const datefield=document.querySelector(".location_time span");
const wheaterfield=document.querySelector(".condition p");
const searchField=document.querySelector(".search_area");
const form=document.querySelector("form");
const reset=document.querySelector("#resetbtn");
const searchBtn = document.querySelector("form button");

// ===== WEATHER ICON =====
function getWeatherIcon(condition){
    condition = condition.toLowerCase();

    if(condition.includes("sun") || condition.includes("clear")) return "☀️";
    if(condition.includes("cloud")) return "☁️";
    if(condition.includes("rain") || condition.includes("drizzle")) return "🌧️";
    if(condition.includes("thunder")) return "⛈️";
    if(condition.includes("snow")) return "❄️";
    if(condition.includes("mist") || condition.includes("fog")) return "🌫️";

    return "🌤️";
}

// ===== FETCH WEATHER =====
const fetchResult=async(targetlogacation)=>{
    let url=`https://api.weatherapi.com/v1/current.json?key=e715f0b84eeb48fbb9873437262603&q=${targetlogacation}&aqi=no`;

    const res=await fetch(url);
    const data= await res.json();

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

// ===== FORM (NOW IMPORTANT) =====
form.addEventListener("submit", (e)=>{
    e.preventDefault();

    let target = searchField.value.trim();
    if(target === "") return;

    fetchResult(target);
});

// ===== UPDATE UI =====
function updateDetails(locationName, time, temp, condition){

    let splitDate = time.split(" ")[0]
    let splitTime = time.split(" ")[1]

    let currentDay = getDayName(new Date(splitDate).getDay())
    let icon = getWeatherIcon(condition);

    tempfield.innerText = temp;
    locationfield.innerText = locationName;
    datefield.innerText = `${splitDate} ${currentDay} ${splitTime}`;
    wheaterfield.innerText = `${icon} ${condition}`;
}

// ===== RESET =====
reset.addEventListener("click",()=>{
    tempfield.innerText = "--";
    locationfield.innerText = "City";
    datefield.innerText = "Time - Day Date";
    wheaterfield.innerText = "Condition";
    searchField.value = "";
});

// ===== DAY =====
function getDayName(number){
    const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return days[number];
}

// ===== SUGGESTIONS =====
const suggestionsBox = document.querySelector(".suggestions");
let debounceTimer;

const fetchSuggestions = async (query) => {
    if(query.length < 2){
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.remove("active");
        return;
    }

    let url = `https://api.weatherapi.com/v1/search.json?key=e715f0b84eeb48fbb9873437262603&q=${query}`;
    
    const res = await fetch(url);
    const data = await res.json();

    const filtered = data
        .filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);

    showSuggestions(filtered);
};

function showSuggestions(data){
    suggestionsBox.innerHTML = "";

    if(data.length === 0){
        suggestionsBox.innerHTML = `<li>No results found</li>`;
        suggestionsBox.classList.add("active");
        return;
    }

    data.forEach(item => {
        const li = document.createElement("li");

        li.innerText = `${item.name} (${item.region}, ${item.country})`;

       li.addEventListener("click", () => {
    searchField.value = item.name;
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("active");

    // 🔥 Trigger button animation
    searchBtn.classList.add("btn-pop");

    // remove after animation ends
    setTimeout(()=>{
        searchBtn.classList.remove("btn-pop");
    },500);
});

        suggestionsBox.appendChild(li);
    });

    suggestionsBox.classList.add("active");
}

// ===== INPUT =====
searchField.addEventListener("input", ()=>{
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(()=>{
        fetchSuggestions(searchField.value.trim());
    },400);
});

// ===== HIDE =====
document.addEventListener("click",(e)=>{
    if(!e.target.closest("nav")){
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.remove("active");
    }
});