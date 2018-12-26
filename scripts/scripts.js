initMap();

var id = 0;
var markers;
var infowindow;

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -3.75},
        zoom: 5.75,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });

    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);

    var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });

}

function geocodeAddress(geocoder, resultsMap) {

    var address = document.getElementById('address').value;

    geocoder.geocode({'address': address}, function(results, status) {

        if (status === 'OK') {

            if ( resultsMap.getZoom() != 10 ) {
                resultsMap.setZoom(10);
            }

            resultsMap.setCenter(results[0].geometry.location);

            if (markers) {

                var repMarker = false;

                for (let i = 0; i < markers.length; i++) {
                    if ( markers[i].title === results[0].address_components[0].long_name ) {
                        repMarker = true;
                    }
                }

                if ( repMarker === true ) {

                    alert('Marcador repetido');

                } else {

                    var marker = new google.maps.Marker({
                        id: id,
                        map: resultsMap,
                        position: results[0].geometry.location,
                        title: results[0].address_components[0].long_name,
                        snippet: results[0].formatted_address,
                        animation: google.maps.Animation.DROP
                    }, id++);
        
                    markers.push(marker);
        
                    marker.addListener('click', function() {
        
                        infowindow = new google.maps.InfoWindow({
                            content: '<div class="custom-iw"><p>' + this.snippet + '<p></div>',
                        });
        
                        infowindow.open(map, this);
        
                        $('#remove-marker').addClass('active');
                        $('#remove-marker').attr('data-id', marker.id);
        
                    });
                }

            } else {

                var marker = new google.maps.Marker({
                    id: id,
                    map: resultsMap,
                    position: results[0].geometry.location,
                    title: results[0].address_components[0].long_name,
                    snippet: results[0].formatted_address,
                    animation: google.maps.Animation.DROP
                }, id++);
    
                markers = [];
                markers.push(marker);
    
                marker.addListener('click', function() {
    
                    infowindow = new google.maps.InfoWindow({
                        content: '<div class="custom-iw"><p>' + this.snippet + '<p></div>',
                    });
    
                    infowindow.open(map, this);
    
                    $('#remove-marker').addClass('active');
                    $('#remove-marker').attr('data-id', marker.id);
    
                });

            }

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });

}

function deleteMarker() {

    let idd = parseInt($('#remove-marker').attr('data-id'));

    var result = markers.filter(obj => {
        return obj.id === idd
    });

    result[0].setMap(null); // Remove marker from map

    var removeIndex = markers.map(function(item) {
        return item.id;
    }).indexOf(idd);

    markers.splice(removeIndex, 1); // Remove marker from array
    
    if (markers.length == 0) {
        $('#remove-marker').removeClass('active');
    }

}

function getPlaces() {

    for (let i = 0; i < markers.length; i++) {
        console.log(markers[i]);
    }

}