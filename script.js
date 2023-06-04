const key='t56a0jRZdocjbutD4Zz49ISMwH2TWFPcaok2h48H';
const currentDate = new Date().toISOString().split("T")[0];
const currentImgContainer=document.getElementById("current-image-container")
const title=document.createElement('h1');
const imageContainer=document.createElement('div');
const img=document.createElement('img');
imageContainer.setAttribute('id','image-container');
const imgDesc=document.createElement('h3');
const description=document.createElement('p');
const iframe=document.createElement('iframe');

//to get the current day Image on the image-container
function getCurrentImageOfTheDay(){
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=${currentDate}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        title.innerHTML = "NASA Picture of the Day";
        if(!(data.hdurl.includes("video"))){
            img.src = data.hdurl;
            imageContainer.appendChild(img);
        } else {
            iframe.src = data.url;
            iframe.frameborder="0";
            imageContainer.appendChild(iFrame);
        }
        
        imgDesc.innerHTML = data.title;
        description.innerHTML = data.explanation;      
        currentImgContainer.append(title, imageContainer, imgDesc, description);
    })
    .catch((err) => {
        console.log(err);
    })
}
window.addEventListener('load',getCurrentImageOfTheDay);


function getImageOfTheDay(e){
    console.log(currentImgContainer);
    e.preventDefault();
    let date;
    if(e.target.value == "Search"){
        date = document.getElementById('search-input').value;
    } else {
        date = e.target.innerHTML;
    }

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        title.innerHTML = `Picture on ${date}`;
        if(!(data.url.includes("video"))){
            img.src = data.url;
            imageContainer.appendChild(img);
        } else {
            iframe.src = data.url;
            iframe.frameBorder = "0";
            imageContainer.removeChild(img);
            imageContainer.appendChild(iframe);
        }
        imgDesc.innerHTML = data.title;
        description.innerHTML = data.explanation;      
        currentImgContainer.append(title, imageContainer, imgDesc, description);
    })
    .catch((err) => {
        console.log(err);
    })
    if(e.target.value == "Search"){
        saveSearch(date);
    }
}
document.getElementById('search').addEventListener('click', getImageOfTheDay);

// function to save the data in local storage
let history = JSON.parse(localStorage.getItem('History')) || [];
function saveSearch(date){
    history.push({date: `${date}`});
    localStorage.setItem("History", JSON.stringify(history));
    addSearchToHistory();
}

// function to save the data in History
function addSearchToHistory(){
    let searchHistory = document.getElementById('search-history');
    searchHistory.innerHTML = "";
    history.forEach((item) => {
        let li = document.createElement('li');
        let anchor = document.createElement('a');
        anchor.setAttribute('href', "#");
        anchor.innerHTML = item.date;
        li.appendChild(anchor);
        searchHistory.appendChild(li);
    });
    let searchList = document.querySelectorAll('#search-history>li>a');
    searchList.forEach((item) => {
        item.addEventListener('click', getImageOfTheDay);
    });
}

// To make sure that the function loads up soon as the page load up
window.addEventListener('load', addSearchToHistory);