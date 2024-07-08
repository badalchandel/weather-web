const api = "https://api.openweathermap.org/data/2.5/weather?q=bangkok&units=metric&appid=01d9f2d66b5fb9c863aa86b5cb001cd2";
const btn = document.querySelector("button");
const msgc = document.querySelector(".msgc");
const msgt = document.querySelector(".msgt");
const temp = document.querySelector(".temp");
const msgh = document.querySelector(".msgh");
const msgp = document.querySelector(".msgp");
const msgw = document.querySelector(".msgw");
const search = document.querySelector("input");
const refresh = document.querySelector(".refresh");
const img = document.querySelector("img");


const getData = async () => {
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search.value}&units=metric&appid=01d9f2d66b5fb9c863aa86b5cb001cd2
    `);
    if(response.ok){
        let data = await response.json();
    console.log(data);
    let t = data.main.temp;
    let cityName = data.name;
    let humidity = data.main.humidity;
    let pressure = data.main.pressure;
    let weather = data.weather[0].description;
    msgc.innerText =`City:   ${cityName}`;
    msgt.innerText ="Temperature:   ";
    temp.innerText =`${t}°C`;
    msgh.innerText =`Humidity:   ${humidity}`;
    msgp.innerText =`Pressure:   ${pressure}`;
    msgw.innerText =weather;
    }
    else{
        clr()
        msgc.innerText =`${newV.toUpperCase()} ${response.statusText}`;
    }
};

btn.addEventListener("click", () => {
    getRandomImage();
    getData();
});

const clr = ( () => {
    msgc.innerText ="";
    msgt.innerText ="";
    temp.innerText ="";
    msgh.innerText ="";
    msgp.innerText ="";
    msgw.innerText ="";
    newV = search.value;
    search.value ="";
});
    
refresh.addEventListener("click", () => {
    clr();
});


function getRandomImage(){
    const apiKey = 'KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk';
    const url = "https://api.unsplash.com/search/photos?page=10&query=city&client_id=KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk";
    $.ajax({
        type: 'GET',
        url: "https://api.unsplash.com/photos/random/?client_id=KmAl00U7hxyRuHW5mBmMh-rbbRK0hPp-lZwfBJ6xrMk&query=city",
        success: function(response){
            const imageUrl = response.urls.regular;
            const imageHtml = `<img src="${imageUrl}">`;
            $('#image-container').attr('src', imageUrl);
        },
        error: function(error){
            console.error('Error:',error);
        }
    });
}