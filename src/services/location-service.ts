/*
This service gives a promise with an 'estimatedlocation' object,
which contains the most likely estimation of the street etc where the user is.
*/

let longitude: number;
let latitude: number;

// prevent typescript compiler errors
declare let Promise: any;

let estimatedLocation = {
  street: '',
  streetnumber: 1,
  country: '',
  city: ''
};

export let getLocationData = () => {
  return new Promise((resolve: any, reject: any): any => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUM178OdXcUp5HYd7OYHQ3Glj8vbeTymM`);
        xhr.responseType = 'json';
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) { // success

            // here the data is extracted from the JSON in the xhr response
            let addressComponents = xhr.response.results[0].address_components;

            // array.indexOf returns -1 if the item is undefined.
            addressComponents.forEach((addresComponent: any) => {
              if (addresComponent.types.indexOf('country') !== -1) {
                estimatedLocation.country = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('route') !== -1) {
                estimatedLocation.street = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('street_number') !== -1) {
                estimatedLocation.streetnumber = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('locality') !== -1) {
                estimatedLocation.city = addresComponent.long_name;
              }
            });
            resolve(estimatedLocation);
          } else {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          }
        };
        xhr.onerror = function () {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        };
        xhr.send();
      });
    }
  });
};
