// Wait for the HTML document to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Get the user's timezone
  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Display the timezone in the first card and set the dropdown to the user's timezone
  const timezoneElement = document.getElementById("timezone");
  timezoneElement.textContent = timezone;
  const timezoneSelect = document.getElementById("timezone-select");
  const timezones = moment.tz.names();
  for (let i = 0; i < timezones.length; i++) {
    const option = document.createElement("option");
    option.text = timezones[i];
    option.value = timezones[i];
    if (timezones[i] === timezone) {
      option.selected = true;
    }
    timezoneSelect.add(option);
  }

  var yr = document.getElementById("year");
  let year = new Date().getFullYear();
  yr.innerText = year;

  // Update the current time every second and display it in the second card
  console.log("Updating");
  function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById("time");
    timeElement.textContent = now.toLocaleString(undefined, {
      hour12: false,
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  // Update the timezone variable and call updateTime whenever the user selects a new timezone from the dropdown
  timezoneSelect.addEventListener("change", function () {
    timezone = timezoneSelect.value;
    updateTime();
  });

  // Call updateTime initially to display the correct time
  updateTime();
  setInterval(updateTime, 1000);
});

// Define constants for elements and options
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchForm = document.querySelector("form");
const container = document.querySelector(".main");
const weatherOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "c6b1760691msh3fd00140bb8715fp1c9172jsn1de1c9e00d40",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com"
  }
};

// Add event listener for form submission
searchForm.addEventListener("submit", searchWeather);

//hide class
// Search weather function
async function searchWeather(event) {
  event.preventDefault();
  try {
    const input = searchInput.value;
    // HourlyHead.style.visibility = "visible";
    const data = await fetch(
      `https://weatherapi-com.p.rapidapi.com/current.json?q=${input}`,
      weatherOptions
    );
    console.log(data);
    const json = await data.json();
    displayCurrentWeather(json);
    const locationName = json.location.name;
    const currentDate = new Date(json.location.localtime);
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const history = await fetch(
      `https://weatherapi-com.p.rapidapi.com/history.json?q=${locationName}&dt=${year}-${month}-${day}`,
      weatherOptions
    );
    const historyJson = await history.json();
    displayHourlyWeather(historyJson);
  } catch (error) {
    console.error(error);
  }
}


function displayHourlyWeather(data) {
  const hourlyData = data.forecast.forecastday[0].hour;
  const hourlyContainer = document.getElementById("hourly");
  const hOne = document.createElement("h1");

  // hourlyContainer.classList.add("content");
  const cardFlexContainer = document.createElement("div");
  cardFlexContainer.classList.add("d-flex", "flex-row", "p-3", "overlay");
  for (let i = 0; i < 24; i++) {
    const hourCard = document.createElement("div");
    hourCard.classList.add("card", "hour-card", "p-3", "text-light");
    const hourTitle = document.createElement("h5");
    hourTitle.classList.add("card-title");
    hourTitle.textContent = i.toString().padStart(2, "0") + ":00";
    const hourlyInfo = hourlyData[i];
    const hourTemp = document.createElement("p");
    hourTemp.classList.add("card-text");
    hourTemp.innerHTML = `<img src="${hourlyInfo.condition.icon}" class="rounded-circle w-25 img"/>${hourlyInfo.condition.text}
  `;
    hourCard.appendChild(hourTitle);
    hourCard.appendChild(hourTemp);
    cardFlexContainer.appendChild(hourCard);
  }
  hourlyContainer.appendChild(hOne);
  hourlyContainer.appendChild(cardFlexContainer);
  container.style.display = "block";
}

function displayCurrentWeather(data) {

  console.log("This is the data to be displayed", data);
  const weatherDiv = document.getElementById("weather");
            const loadingDiv = document.getElementById("loading");
            loadingDiv.style.display = "none"; // Hide the loading element
  const locationName = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
  const weatherIcon = data.current.condition.icon;
  const conditionText = data.current.condition.text;

  document.getElementById("location-name").textContent = locationName;
  document.getElementById("weather-icon").src = weatherIcon;
  document.getElementById("weather-condition").textContent = conditionText;
  
  document.getElementById("last-updated").textContent = data.current.last_updated;
  document.getElementById("temp-c").textContent = data.current.temp_c;
  document.getElementById("temp-f").textContent = data.current.temp_f;
  document.getElementById("wind-mph").textContent = data.current.wind_mph;
  document.getElementById("wind-kph").textContent = data.current.wind_kph;
  document.getElementById("humidity").textContent = data.current.humidity;
  document.getElementById("vis-km").textContent = data.current.vis_km;
  document.getElementById("vis-miles").textContent = data.current.vis_miles;
  document.getElementById("uv").textContent = data.current.uv;
}


// Add a loading element
const loadingDiv = document.createElement("div");
loadingDiv.setAttribute("id", "loading");
document.body.appendChild(loadingDiv);

// Get user IP address
fetch("https://api.ipify.org/?format=json")
  .then((response) => response.json())
  .then((data) => {
    // console.log(data); // Check if IP address was fetched successfully
    return fetch(
      `https://weatherapi-com.p.rapidapi.com/ip.json?q=${data.ip}`,
      weatherOptions
    )
      .then((response) => response.json())
      .then((ipData) => {
        // console.log(ipData); // Check if location was fetched successfully
        const locationName = `${ipData.city}, ${ipData.region}, ${ipData.country_name}`;
        return fetch(
          `https://weatherapi-com.p.rapidapi.com/current.json?q=${ipData.region}`,
          weatherOptions
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("This is current weather", data)
            displayCurrentWeather(data)
            document.addEventListener("DOMContentLoaded", function () {
              //more details
              const moreDetailsButton = document.getElementById("mdet-btn");
              const secondCard = document.getElementById("lisht");

              moreDetailsButton.addEventListener("click", function () {
                secondCard.classList.toggle("more-details");
              });
            });
          })
          .then((timezonedata) => {
            return fetch(
              `https://weatherapi-com.p.rapidapi.com/timezone.json?q=${data.ip}`,
              weatherOptions
            )
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              });
          });
      });
  })
  .catch((error) => console.error(error));

// Get user IP address
function getUserIPAddress() {
  return fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch((error) => console.error(error));
}

// Call the function to get the user's IP address and add it to the headers
getUserIPAddress().then((ipAddress) => {
  const url =
    "https://bing-news-search1.p.rapidapi.com/news?safeSearch=Off&textFormat=Raw";
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/octet-stream",
      "X-BingApis-SDK": "true",
      "X-RapidAPI-Key": "c6b1760691msh3fd00140bb8715fp1c9172jsn1de1c9e00d40",
      "X-RapidAPI-Host": "bing-news-search1.p.rapidapi.com",
      "X-MSEdge-ClientIP": ipAddress
    }
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const projectsContainer = document.getElementById("projects");

      data.value.forEach((project) => {
        function formatDate(dateString) {
          const date = new Date(dateString);
          const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "short"
          };
          return date.toLocaleDateString(undefined, options);
        }
        const fallbackImageUrl =
          "https://plus.unsplash.com/premium_photo-1677456384043-d131d8db2a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODIzNjY2NjU&ixlib=rb-4.0.3&q=80&w=400";

        const thumbnailUrl =
          project.image?.thumbnail?.contentUrl || fallbackImageUrl;

        if (!project.image?.thumbnail.contentUrl) {
          project.image.thumbnail.contentUrl = {
            contentUrl:
              "https://plus.unsplash.com/premium_photo-1677456384043-d131d8db2a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODIzNjY2NjU&ixlib=rb-4.0.3&q=80&w=400"
          };
        }

        const projectHtml = `
        <a href="${
          project.ampUrl
        }" class="col-md-4 col-sm-6 mb-4 bg-info text-black" target="_blank" rel="noopener noreferrer">
          <div class="card bg-white">
            <img src="${thumbnailUrl}" class="card-img card-img-top" alt="">
            <div class="card-body">
              <h3 class="card-title fw-bold">${project.name}</h3>
                   <div class="card-foot">
            <p class="text-center fs-7">${project.description}</p>
  <hr />
  <small class="text-center">
    <p class="card-text">Last Updated ${formatDate(project.datePublished)}</p>
  </small>
</div>
            </div>
       

          </div>
      `;
        projectsContainer.insertAdjacentHTML("beforeend", projectHtml);
      });
    })
    .catch((error) => {
      console.error(error);
    });
});



async function dummyData() {
  const url = "assets/js/data.json";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
  const newsCont = document.getElementById("news");
  const flexCont = document.createElement("div");
  flexCont.classList.add("row", "row-cols-auto");

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let r = "technology";
      if (element.id == r) {
        element.stories.forEach((stry) => {
          const strCard = document.createElement("div");
          strCard.classList.add("card", "col-md-6", "strCard", "border-info");
          strCard.innerHTML = `
            <div class="card-body">
            <h2 class="card-title">${
              stry.abstract[1] ? stry.abstract[0] : stry.title.toString()
            }</h2>
            <h4 class="fs-5 card-subtitle fst-italic mb-2">${
              stry.autoGeneratedSummary
            }</h4>
            <div class="card-footer">
            <ul class="list-group list-group-flush list-unstyled">
              <li class="list-group-item">Published ${new Date(
                stry.published * 1000
              ).toDateString()}</li>
              <hr />
              <li class="list-group-item auth">Author<small>(s)</small>: ${
                stry.byline
              }</li>
              <li class="list-group-item"></li>
            </ul>
            </div>
            </div>
            `;
          strCard.addEventListener("click", () => {
            window.open(stry.longURL);
          });
          flexCont.appendChild(strCard);
          newsCont.appendChild(flexCont);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// dummyData();
