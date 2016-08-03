import {h, Projector} from 'maquette';
let jstz = <any>require('jstz');

export interface LocationInfoConfig {
  projector: Projector;
}

export interface LocationInfoBindings {}

export let createLocationInfo = (config: LocationInfoConfig, bindings: LocationInfoBindings) => {
  let {projector} = config;
  let {} = bindings;

  const timezone = jstz.determine();

  let longitude: number;
  let latitude: number;

  let estimatedStreet: string;
  let estimatedStreetNumber: string;
  let estimatedCountry: string;
  let estimatedCity: string;

  let getJSON = (url: string, callback: any) => {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      let status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

  let getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function showPosition(position) {
        longitude = position.coords.longitude;
        latitude = position.coords.latitude;

        /* currently using maps API from Google, using a private key from Lukas Bos,
         which CAN NOT be used for commercial purposes. */
        getJSON(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCUM178OdXcUp5HYd7OYHQ3Glj8vbeTymM`,
        function(err: Error, data: any) {
          if (err != null) {
            console.error("Something went wrong: " + err);
          } else {
            let addressComponents = data.results[0].address_components;
            addressComponents.forEach((addresComponent: any) => {
            if (addresComponent.types.indexOf('country') !== -1) {
               estimatedCountry = addresComponent.long_name;
             } else if (addresComponent.types.indexOf('route') !== -1){
                estimatedStreet = addresComponent.long_name;
             } else if (addresComponent.types.indexOf('street_number') !== -1){
                estimatedStreetNumber = addresComponent.long_name;
             } else if (addresComponent.types.indexOf('locality') !== -1){
                estimatedCity = addresComponent.long_name;
             }
           });
           projector.scheduleRender();
          }
        });
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };
  getLocation();

  return {
    renderMaquette: () => {
      return h('p', [`we think you are living in ${estimatedCountry} in the city ${estimatedCity} at ${estimatedStreet} ${estimatedStreetNumber}`]);
    }
  };
};
