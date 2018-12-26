initMap();

var map;
var id = 0;
var markers;
var infowindow;
var myResults;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40, lng: -3.75},
        zoom: 5.75,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false
    });

    var input = document.getElementById('address');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setComponentRestrictions(
        {'country': 'es'}
    );

    var geocoder = new google.maps.Geocoder();
        document.getElementById('submit').addEventListener('click', function() {
        geocodeAddress(geocoder);
    });

}

function geocodeAddress(geocoder) {

    var address = document.getElementById('address').value;

    geocoder.geocode({'address': address}, function(results, status) {

        myResults = results;

        if (status === 'OK') {

            if ( map.getZoom() != 10 ) {
                map.setZoom(10);
            }

            map.setCenter(results[0].geometry.location);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }

    });

}

function deleteMarker() {

    let idd = parseInt($('.action-btn').attr('data-id'));

    var result = markers.filter(obj => {
        return obj.id === idd
    });

    result[0].setMap(null); // Remove marker from map

    var removeIndex = markers.map(function(item) {
        return item.id;
    }).indexOf(idd);

    markers.splice(removeIndex, 1); // Remove marker from array
    
    if (markers.length == 0) {
        $('#btn-remove').removeClass('active');
    }

    saveMarkers();

}

function addMarker () {

    var type = [];

    $('.form-check-input:checked').each(function(i) {
        type.push($(this).val());
    });

    if (markers) {

        var repMarker = false;

        for (let i = 0; i < markers.length; i++) {
            if ( markers[i].title === myResults[0].address_components[0].long_name ) {
                repMarker = true;
            }
        }

        if ( repMarker === true ) {

            alert('Marcador repetido');

        } else {

            var marker = new google.maps.Marker({
                id: id,
                map: map,
                position: myResults[0].geometry.location,
                title: myResults[0].address_components[0].long_name,
                snippet: myResults[0].formatted_address,
                name: document.getElementById('name').value,
                tipo: type,
                draggable: true,
                animation: google.maps.Animation.DROP
            }, id++);

            markers.push(marker);

            marker.addListener('click', function() {

                infowindow = new google.maps.InfoWindow({
                    content: 
                    `<div class="custom-iw">
                        <p><b>` + this.name + `</b><p>
                        <p>Location: ` + this.title + `<p>
                    </div>`,
                });

                infowindow.open(map, this);

                $('#btn-remove').addClass('active');
                $('.action-btn').attr('data-id', marker.id);

            });
        }

    } else {

        var marker = new google.maps.Marker({
            id: id,
            map: map,
            position: myResults[0].geometry.location,
            title: myResults[0].address_components[0].long_name,
            snippet: myResults[0].formatted_address,
            name: document.getElementById('name').value,
            tipo: type,
            draggable: true,
            animation: google.maps.Animation.DROP
        }, id++);

        markers = [];
        markers.push(marker);

        marker.addListener('click', function() {

            infowindow = new google.maps.InfoWindow({
                content: 
                `<div class="custom-iw">
                    <p><b>` + this.name + `</b><p>
                    <p>Location: ` + this.title + `<p>
                </div>`,
            });

            infowindow.open(map, this);

            $('#btn-remove').addClass('active');
            $('.action-btn').attr('data-id', marker.id);

        });

    }

    saveMarkers();

}

function saveMarkers() {

    var miObj;

    for (let i = 0; i < markers.length; i++) {

        miObj = {
            id: markers[i].id,
            place: markers[i].snippet,
            type: markers[i].tipo,
            position: {
                lat: markers[i].getPosition().lat(),
                lng: markers[i].getPosition().lng()
            }

        }

    }

    console.log( miObj );

}