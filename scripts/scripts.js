initMap();

function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -3.75},
        zoom: 5.75,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });

    var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });

}

var markers = [];

function geocodeAddress(geocoder, resultsMap) {

    var address = document.getElementById('address').value;

    geocoder.geocode({'address': address}, function(results, status) {

        if (status === 'OK') {

            resultsMap.setZoom(10);
            resultsMap.setCenter(results[0].geometry.location);
            
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title: 'Posición',
                snippet: results[0].formatted_address,
                draggable: true,
                animation: google.maps.Animation.DROP
            });

            markers.push(marker);

            var infowindow = new google.maps.InfoWindow({
                content: '<div class="custom-iw"><p><b>' + marker.title + '</b></p><p>' + marker.snippet + '<p></div>'
            });

            marker.addListener('click', function() {
                $('#remove-marker').css('display', 'block');
                $('#remove-marker').attr('data-place', results[0].place_id);
                infowindow.open(map, marker);
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });

}

function deleteMarker() {
    console.log(markers);
    // var marker = markers[id]; // find the marker by given id
    // marker.setMap(null);
}


$(document).ready(function() {


});