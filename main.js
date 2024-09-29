const storage = {
  city: "",
  country: "",
  saveItem() {
    localStorage.setItem("BD-city", this.city);
    localStorage.setItem("BD-country", this.country);
  },
  getItem() {
    const city = localStorage.getItem("BD-city");
    const country = localStorage.getItem("BD-country");
    return {
      city,
      country,
    };
  },
};

const weatherData = {
  city: "",
  country: "",
  API_KEY: "8f1710695d86c2faae04ab4f2365e4cf",
  async getWeather() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.city},${this.country}&appid=${this.API_KEY}&units=metric`
      );
      const { name, main, weather } = await res.json();
      return {
        name,
        main,
        weather,
      };
    } catch (err) {
      console.log(err);
      UI.showMessage("Error in fetching data");
    }
  },
};

const UI = {
  loadSelector() {
    const countryElm = document.querySelector("#country");
    const cityElm = document.querySelector("#city");
    const cityInfoElm = document.querySelector("#w-city");
    const temperatureElm = document.querySelector("#w-temp");
    const pressureElm = document.querySelector("#w-pressure");
    const humidityElm = document.querySelector("#w-humidity");
    const feelElm = document.querySelector("#w-feel");
    const iconElm = document.querySelector("#w-icon");
    const messageElm = document.querySelector("#messageWrapper");
    const formElm = document.querySelector("#form");

    return {
      countryElm,
      cityElm,
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
      messageElm,
      formElm,
    };
  },

  hideMessage() {
    const messageElm = document.querySelector("#message");
    setTimeout(() => {
      if (messageElm) {
        messageElm.remove();
      }
    }, 2000);
  },

  showMessage(msg) {
    const { messageElm } = this.loadSelector();
    const elm = `<div class="alert alert-danger" id="message">${msg}</div>`;
    messageElm.innerHTML = "";
    messageElm.insertAdjacentHTML("afterbegin", elm);

    // Hide the message after displaying
    this.hideMessage();
  },

  validateInput(country, city) {
    if (country === "" || city === "") {
      this.showMessage("Please provide necessary input");
      return false;
    }
    return true;
  },

  getInputValues() {
    const { countryElm, cityElm } = this.loadSelector();
    const country = countryElm.value.trim();
    const city = cityElm.value.trim();

    // Validate the input values
    const isValid = this.validateInput(country, city);

    if (!isValid) {
      return null;
    }

    return {
      country,
      city,
    };
  },

  resetInputs() {
    const { cityElm, countryElm } = this.loadSelector();
    cityElm.value = "";
    countryElm.value = "";
  },
  async handleRemoteData() {
    const data = await weatherData.getWeather();
    console.log(data);
    return data;
  },
  getIcon(iconCode) {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  },
  populateUI(data) {
    const {
      cityInfoElm,
      temperatureElm,
      pressureElm,
      humidityElm,
      feelElm,
      iconElm,
    } = this.loadSelector();
    const {
      name,
      main: { temp, pressure, humidity },
      weather,
    } = data;
    cityInfoElm.textContent = name;
    temperatureElm.textContent = `Temperature: ${temp} °C`;
    pressureElm.textContent = `Pressure: ${pressure} Kpa`;
    humidityElm.textContent = `Humidity: ${humidity}`;
    feelElm.textContent = weather[0].description;
    iconElm.setAttribute("src", this.getIcon(weather[0].icon));
  },
  setDataToStorage(inputs) {
    weatherData.city = inputs.city;
    weatherData.country = inputs.country;
  },
  setDataToLocalStorage(inputs) {
    storage.city = inputs.city;
    storage.country = inputs.country;
  },

  // Initialize the UI and set up event listeners
  init() {
    const { formElm } = this.loadSelector();
    formElm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get input values and check if not null
      const inputs = this.getInputValues();
      if (!inputs) return;
      // setting data to data storage
      this.setDataToStorage(inputs);

      // setting data to local storage
      this.setDataToLocalStorage(inputs);
      storage.saveItem();
      // Reset input fields after successful input retrieval
      this.resetInputs();
      // send data to the api server
      const data = await this.handleRemoteData();
      this.populateUI(data);
      console.log(data);

      // console.log(inputs);
    });
    window.addEventListener("DOMContentLoaded", async (e) => {
      let { city, country } = storage.getItem();
      if (!city || !country) {
        city = "Chittagong";
        country = "BD";
      }
      weatherData.city = city;
      weatherData.country = country;
      const data = await this.handleRemoteData();
      this.populateUI(data);
      console.log(data);
    });
  },
};
UI.init();
