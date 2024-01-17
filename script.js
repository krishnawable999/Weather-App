
const usertab = document.querySelector("[data-userdata]");
const searchtab = document.querySelector("[data-searchdata]");
const userContainer = document.querySelector(".weather-container");
const grantAccesscontainer = document.querySelector(".grant-location");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-conatiner");
const userinfo = document.querySelector(".userinfo-container");

const API = "2b2f80381b743db1ec054c0977793d0e";
let currentTab = usertab;
currentTab.classList.add("current-tab");
getfromsessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userinfo.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // pehle search wale tab the
            searchForm.classList.remove("active");
            userinfo.classList.remove("active");
            getfromsessionStorage();
        }
    }
}

usertab.addEventListener("click",() => {
    switchTab(usertab);
});

searchtab.addEventListener("click", () => {
    switchTab(searchtab);
});

// check for coordinates are already stored in session storage
function getfromsessionStorage(){
    const localcoordinates = sessionStorage.getItem("user-coordinates");
    if(!localcoordinates){
        //if local co-ordinates not found
    grantAccesscontainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localcoordinates);
        fetchUserweatherinfo(coordinates);
    }
     
}

async function fetchUserweatherinfo(coordinates){
    const{lat,lon} = coordinates;
    // make grant container invisible
    grantAccesscontainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // api call
    try{
        const responce = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`
        );
    const data = await responce.json();

    loadingScreen.classList.remove("active");
    userinfo.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    // fetch the elements first
    const cityname = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");

    // fetch valus from weather info object
    cityname.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show an alert to show no geolocation available
    }
}

function showPosition(position){
    const usercoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    }
        sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
        fetchUserweatherinfo(usercoordinates);
}

const grantaccessbtn = document.querySelector("[data-grantAccess]");
grantaccessbtn.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityname = searchInput.value;

    if(cityname === ""){
        return;
    }
    else{
        fetchSearchWeatherinfo(cityname);
    }
});

async function fetchSearchWeatherinfo(city){
    loadingScreen.classList.add("active");
    userContainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");

    try{
        const responce = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
        const data = await responce.json();
        loadingScreen.classList.remove("active");
        userContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        
    }
}