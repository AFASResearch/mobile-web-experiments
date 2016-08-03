let longitude: number;
let latitude: number;

let estimatedLocation = {
  street: '',
  streetnumber: 1,
  country: '',
  city: '',
}

export let getLocationData = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUM178OdXcUp5HYd7OYHQ3Glj8vbeTymM`);
        xhr.responseType = "json";
        xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {

            let addressComponents = xhr.response.results[0].address_components;

            addressComponents.forEach((addresComponent: any) => {
              if (addresComponent.types.indexOf('country') !== -1) {
                estimatedLocation.country = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('route') !== -1){
                estimatedLocation.street = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('street_number') !== -1){
                estimatedLocation.streetnumber = addresComponent.long_name;
              } else if (addresComponent.types.indexOf('locality') !== -1){
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
}
