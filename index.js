const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
//const grantAccessContainer=document.querySelector(".")

const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorContainer=document.querySelector('.error-container');

let currentTab=userTab;
const API_KEY="3f313d04d61bd4c0c79e1e541ed9ed57";
currentTab.classList.add("current-tab");
getfromSessionStorage();

// errorContainer.classList.remove('active');

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        // to switch to the search weather 
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        // to switch to the user weather
        else{
            userInfoContainer.classList.remove("active");
          
            searchForm.classList.remove("active");
            getfromSessionStorage();
        
        }
    }

}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
})


function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){

    const {lat,lon}=coordinates;
    // make grantcontainer invisible
    //console.log(grantAccessContainer.classList);
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
   // console.log(coordinates);
   // console.log(grantAccessContainer.classList);


    // API CALL

    try{
        console.log("try block start");
    
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        loadingScreen.classList.remove("active");
        console.log(`loadingScreen.classList ${loadingScreen.classList}`);
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
        console.log(data);
        console.log("fetcḥed data");

    }catch(e){
        console.log(e)
        loadingScreen.classList.remove("active");
        // hw
        grantAccessContainer.classList.add("active");

    }

} 

function renderWeatherInfo(weatherInfo){
    //firstl, we have to fetch the data
    console.log("fetching user weather info");
    console.log(weatherInfo);

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    //console.log(weatherIcon);
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    console.log(cityName);
    console.log(weatherInfo?.name)
    console.log(`${weatherInfo?.sys?.country}.lowercase()`);
    console.log(weatherIcon);

    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   // console.log(`${weatherInfo?.sys?.country.tolowercase()}`);
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    console.log(weatherIcon);
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${ weatherInfo?.main?.temp}°C` ;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s` ;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("user browser do not supporting to access this app");
        //hw - show the alert for no geolocation support available
    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const getAccessButton = document.querySelector("[data-grantAccess]");
getAccessButton.addEventListener("click",getLocation);


let searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if(searchInput.value===""){
        return;
    }
    fetchSearchWeatherInfo(searchInput.value);

});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");
    console.log("feching the information")

    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
       
        if (data.message==='city not found') {
            console.log(data.message);
            console.log(errorContainer);
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.remove('active');
            errorContainer.classList.add("active");
            errorContainer.src=src="assets/weatherAppProject/assets/not-found.png";
            console.log(errorContainer);

            
            return;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        console.log("fetched information");
        //console.log('404 not found')
       
    }
    catch(err){
        console.log(err);
    }
}