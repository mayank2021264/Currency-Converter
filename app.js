const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";
const API_KEY = "fca_live_OyQHc5wVhTcva6nOSqSG9jlnIpd6K5YoZ8KILFx6"; // Replace with your actual API key

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Ensure countryList is available globally from another JS file

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }
    const URL = `${BASE_URL}?apikey=${API_KEY}`;
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Network response was not ok");

    let data = await response.json();
    console.log("API Response:", data);

    let fromRate = data.data[fromCurr.value];
    let toRate = data.data[toCurr.value];

    if (!fromRate || !toRate) {
      throw new Error("Rate not found");
    }

    let rate = toRate / fromRate;
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Sorry for inconvenience. Conversion rates are not avaialble for this currency pair.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
