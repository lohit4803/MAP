const btn = document.getElementById("submitBtn");
const ipContainer = document.querySelector(".ipContainer");
const container = document.querySelector(".container");
const imgContainer = document.querySelector(".imgContainer");
let ipAddress;
let postOfficeDetails;
const token = "765e3af014b109";

// this will give the ip Address onload

window.addEventListener("DOMContentLoaded", function () {
  $.getJSON("https://api.ipify.org?format=json", function (data) {
    // Setting text of element P with id gfg
    $("#getIpAddress").html(data.ip);
    ipAddress = data.ip;
  });
});
/* Add "https://api.ipify.org?format=json" statement
             this will communicate with the ipify servers in
             order to retrieve the IP address $.getJSON will
             load JSON-encoded data from the server using a
             GET HTTP request */
btn.addEventListener("click", () => {
  getIpAddressInfo();
  console.log(ipAddress);
  console.log("first");
  ipContainer.style.display = "none";
  imgContainer.style.display = "none";
  container.style.display = "block";
});

async function getIpAddressInfo() {
  try {
    let response = await fetch(`https://ipinfo.io/${ipAddress}?token=${token}`);
    let geoData = await response.json();
    console.log(geoData);
    renderData(geoData);
  } catch (error) {
    console.log(error);
  }
  document.getElementById("ipAddress").innerText = ipAddress;
}

function renderData(data) {
  console.log(data);
  const { city, region, loc, org, postal, timezone } = data;

  let longitudeLatitude = loc.split(",");
  document.getElementById("lat").innerText = longitudeLatitude[0];
  document.getElementById("long").innerText = longitudeLatitude[1];
  document.getElementById("organisation").innerText = org;
  document.getElementById("region").innerText = region;
  document.getElementById("city").innerText = city;
  document.getElementById("hostname").innerText = location.hostname;

  let latitude = longitudeLatitude[0];
  let longitude = longitudeLatitude[1];

  renderGoogleMap(loc);
  fetchDataByPincode(postal, timezone);
}

function renderGoogleMap(loc) {
  let imageSection = document.getElementById("imageSection");
  imageSection.innerHTML = `
                  <iframe 
                      src="https://maps.google.com/maps?q=${loc}&z=15&output=embed" 
                   </iframe>
                               `;
}
function addMoreInfo(pincode, Timezone, dateAndTime, message) {
  document.getElementById("moreInfoSection").innerHTML = `
                                  <p>Time Zone : ${Timezone}</p>
                                  <p>Date And Time  : ${dateAndTime}</p>
                                  <p>Pincode  : ${pincode}</p>
                                  <p>Message : ${message}</p>
    `;
}

async function fetchDataByPincode(pincode, Timezone) {
  try {
    let response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    let data = await response.json();
    let finalData = data[0];
    let message = finalData.Message;
    postOfficeDetails = finalData.PostOffice;
    // console.log(postOfficeDetails)
    // console.log(message)
    let dateAndTime = new Date().toLocaleString("en-US", {
      timeZone: Timezone,
    });
    //  console.log(dateAndTime)

    addMoreInfo(pincode, Timezone, dateAndTime, message);
    addCards(postOfficeDetails);
  } catch (error) {
    console.log(error);
  }
}

function addCards(postOfficeDetails) {
  let cards = document.getElementById("cards");
  cards.innerHTML = "";
  postOfficeDetails.forEach((element) => {
    let name = element.Name;
    let branch = element.BranchType;
    let district = element.district;
    let division = element.Division;

    let card = document.createElement("div");
    card.setAttribute("class", "card");
    card.innerHTML = `<p>Name : ${name} </p>
                        <p>Branch Type : ${branch}  </p>
                        <p>District : ${district}</p>
                        <p>Division : ${division} </p>
                         `;
    cards.appendChild(card);
  });
}

document.getElementById("input").addEventListener("keyup", (event) => {
  let target = event.target.value;
  let filterArr = postOfficeDetails.filter((element) => {
    return (
      element.Name.toLowerCase().includes(target.toLowerCase()) ||
      element.BranchType.toLowerCase().includes(target.toLowerCase())
    );
  });
  addCards(filterArr);
});
