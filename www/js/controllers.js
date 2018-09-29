angular.module('controllers', [])

// controller to populate start
.controller('AjaxCtrl', function($scope){
  $scope.country = {};
    $scope.state = {};
    $scope.city = {};
    var allCountries = [{
        Id: 1,
        CountryName: "PRAÇA DOS HERÓIS"
    }, {
        Id: 2,
        CountryName: "COSTA DO SOL"
    }, {
        Id: 3,
        CountryName: "STANDARD BANK"
    }, {
        Id: 4,
        CountryName: "MUSEU"
    }];
    var allStates = [
      {Id:1,
        StateName: "MINISTERIO DA JUSTICA",
        CountryId: 1
      },
      {Id:1,
        StateName: "POLANA SHOPPING",
        CountryId: 1
      },
      {Id:1,
        StateName: "BARCLAYS",
        CountryId: 1
      },
      {Id:1,
        StateName: "CINEMA XENON",
        CountryId: 1
      },
      {Id:1,
        StateName: "BOMBAS TOTAL",
        CountryId: 1
      },
      {Id:1,
        StateName: "DESTACAMENTO FEMENINO",
        CountryId: 1
      },
      {Id:1,
        StateName: "UEM",
        CountryId: 1
      },
      {Id:1,
        StateName: "CAFE SOL",
        CountryId: 1
      },
      {Id:1,
        StateName: "BIM",
        CountryId: 1
      },
      {Id:1,
        StateName: "SOVESTE",
        CountryId: 1
      },
      {Id:1,
        StateName: "RONIL",
        CountryId: 1
      },
      {
        Id:1,
        StateName: "MAVALANE",
        CountryId: 1
      }
    ];
    var allCities = [{
        Id: 1,
        CityName: "Washington DC",
        StateId: 1
    }, {
        Id: 2,
        CityName: "New York City",
        StateId: 2
    }, {
        Id: 3,
        CityName: "Brisbane",
        StateId: 3
    } ];

    $scope.countries = allCountries;

    $scope.$watch('country', function () {
        $scope.states = allStates.filter(function (s) {
          console.log(s.CountryId);
            return s.CountryId == $scope.country.Id;
        });
        $scope.city = {};
        $scope.state = {};
        $scope.cities = [];
    });

    $scope.$watch('state', function () {
        $scope.cities = allCities.filter(function (c) {
          console.log('states');
            return c.StateId == $scope.state.Id;
        });
        $scope.city = {};
    });
})
// controller to populate end.

.controller('PlaceCtrl', function($scope, place){
  $scope.place = place;
})


.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading, GooglePlacesService){
  // Central Park location
  var maputo = {
    lat: -25.953724,
    lng: 32.588711
  };

  $scope.mbclient = {} ;


  $scope.customMarkers = [
    {
      lat: maputo.lat,
      lng: maputo.lng,
      class: "custom-marker",
      text: "Maputo"
    }
  ];

  // Init the center position for the map
  $scope.latitude = maputo.lat;
  $scope.longitude = maputo.lng;

  // Google Places search
  $scope.search = { input: '' };
  $scope.predictions = [];

  // Keep track of every marker we create. That way we can remove them when needed
  $scope.markers_collection = [];
  $scope.markers_cluster = null;

  

  // To properly init the google map with angular js
  $scope.init = function(map) {
    $scope.mymap = map;
    $scope.$apply();
  };

  var showPlaceInfo = function(place){
        $state.go('place', {placeId: place.place_id});
      },
      cleanMap = function(){
        // Remove the markers from the map and from the array
        while($scope.markers_collection.length){
          $scope.markers_collection.pop().setMap(null);
        }

        // Remove clusters from the map
        if($scope.markers_cluster !== null){
          $scope.markers_cluster.clearMarkers();
        }
      },
      createMarker = function(place){
        // Custom image for marker
        var custom_marker_image = {
              url: '../img/ionic_marker.png',
              size: new google.maps.Size(30, 30),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(0, 30)
            },
            marker_options = {
              map: $scope.mymap,
              icon: custom_marker_image,
              animation: google.maps.Animation.DROP
            };

        // Handle both types of markers, places markers and location (lat, lng) markers
        if(place.geometry){
          marker_options.position = place.geometry.location;
        }
        else {
          marker_options.position = place;
        }

        var marker = new google.maps.Marker(marker_options);

        // For the places markers we are going to add a click event to display place details
        if(place.place_id){
          marker.addListener('click', function() {
            showPlaceInfo(place);
          });
        }

        $scope.markers_collection.push(marker);

        return marker;
      },
      createCluster = function(markers){
        // var markerClusterer = new MarkerClusterer($scope.mymap, markers, {
        $scope.markers_cluster = new MarkerClusterer($scope.mymap, markers, {
          styles: [
            {
              url: '../img/i1.png',
              height: 53,
              width: 52,
              textColor: '#FFF',
              textSize: 12
            },
            {
              url: '../img/i2.png',
              height: 56,
              width: 55,
              textColor: '#FFF',
              textSize: 12
            },
            {
              url: '../img/i3.png',
              height: 66,
              width: 65,
              textColor: '#FFF',
              textSize: 12
            },
            {
              url: '../img/i4.png',
              height: 78,
              width: 77,
              textColor: '#FFF',
              textSize: 12
            },
            {
              url: '../img/i5.png',
              height: 90,
              width: 89,
              textColor: '#FFF',
              textSize: 12
            }
          ],
          imagePath: '../img/i'
        });
      };




  $scope.tryGeoLocation = function(){
    $ionicLoading.show({
      template: 'Getting current position ...'
    });

  }

   

  $scope.getDirections = function () {
  //   $scope.directions.destination = {
  //      $scope.directions = {
  //     destination: "MCG Melbourne, Australia",
  //      showList: false
  // }
  //   }
    var request = {
      origin: $scope.directions.origin,
      destination: $scope.directions.destination,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    
    $scope.mbclient = $scope.directions.origin;
    console.log (mbclient);

    directionsService.route(request, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap($scope.map.control.getGMap());
        directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.showList = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }


    // Clean map
    cleanMap();
    $scope.search.input = "";

    $cordovaGeolocation.getCurrentPosition({
      timeout: 10000,
      enableHighAccuracy: true
    }).then(function(position){
      $ionicLoading.hide().then(function(){
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;

        createMarker({lat: position.coords.latitude, lng: position.coords.longitude});
      });
    });
  

  $scope.getPlacePredictions = function(query){
    if(query !== "")
    {
      GooglePlacesService.getPlacePredictions(query)
      .then(function(predictions){
        $scope.predictions = predictions;
      });
    }else{
      $scope.predictions = [];
    }
  };

  $scope.selectSearchResult = function(result){
    $scope.search.input = result.description;
    $scope.predictions = [];

    $ionicLoading.show({
      template: 'Searching restaurants near '+result.description+' ...'
    });

    // With this result we should find restaurants arround this place and then show them in the map
    // First we need to get LatLng from the place ID
    GooglePlacesService.getLatLng(result.place_id)
    .then(function(result_location){
      // Now we are able to search restaurants near this location
      GooglePlacesService.getPlacesNearby(result_location)
      .then(function(nearby_places){
        // Clean map
        cleanMap();

        $ionicLoading.hide().then(function(){
          // Create a location bound to center the map based on the results
          var bound = new google.maps.LatLngBounds(),
              places_markers = [];

          for (var i = 0; i < nearby_places.length; i++) {
  		      bound.extend(nearby_places[i].geometry.location);
  		      var place_marker = createMarker(nearby_places[i]);
            places_markers.push(place_marker);
  		    }

          // Create cluster with places
          createCluster(places_markers);

          var neraby_places_bound_center = bound.getCenter();

          // Center map based on the bound arround nearby places
          $scope.latitude = neraby_places_bound_center.lat();
          $scope.longitude = neraby_places_bound_center.lng();

          // To fit map with places
          $scope.mymap.fitBounds(bound);
        });
      });
    });
  };

})

;
