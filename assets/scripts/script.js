$(function () {

    var dragHandler = {
        objectIndex: 0,
        init: function () {
            // Drag graph
            var dropArea = $('.drop-area');

            // Append html on drop area on pageload
            savePositions.init();
            if (localStorage.graphObjects) {
                var localGraphObjects = JSON.parse(localStorage.graphObjects);
                if (localGraphObjects.length) {
                    for (var i = 0; i < localGraphObjects.length; i++) {
                        var graphHtml = $('<div />').append($('.lfgraph-obj[data-type="' + localGraphObjects[i] + '"]').clone()).html();
                        dropArea.append(graphHtml);
                        dropArea.find('.lfgraph-obj').addClass('received');
                        switch (localGraphObjects[i]) {
                            case "0":
                                updateMap(dropArea);
                                break;

                            default:
                                break;
                        }
                    }
                }
            }
            dropArea.sortable({
                connectWith: ".drop-area",
                handle: ".lfgraph-header",
                revert: true,
                receive: function (event, ui) {
                    var target = $(event.toElement).closest('.lfgraph-obj');
                    target.addClass('received');
                    target.attr('data-index', dragHandler.objectIndex);
                    dragHandler.objectIndex++;

                    var check = $(event.toElement).attr('id');
                    switch (check) {
                        case "maps":
                            updateMap(target);
                            break;

                        case "graph":
                            var gra = $(target).find('.plot-chart')[0].id;
                            var temp = $(target).find('.plot-chart .temp-num').val();
                            var title = $(target).find('.plot-chart .temp-title').val();
                            var data = { "gra": gra, "temp": temp, "title": title };
                            graphCurrentWeather.init(data);
                            break;

                        case "farm_info":
                        // getJson.getFarmInfomation();

                        default:
                            break;
                    }
                }
            }).disableSelection();

            // Remove icon
            $('body').on('click', '.remove-btn', function () {
                $(this).closest('.lfgraph-obj').remove();
            });
            // Edit icon
            $('body').on('click', '.edit-btn', function () {
                var tag = $(this).closest('.lfgraph-obj');
                tag.find('.content-body .form-control-static').addClass("hidden");
                tag.find('.content-body #farm-info input').removeClass("hidden");
                tag.find('.content-body #farm-info button').removeClass("hidden");

            });
            // Minimize icon
            $('body').on('click', '.minimize-btn', function () {
                var $this = $(this);
                $this.toggleClass("opened");
                $this.closest('.lfgraph-obj').find('.content-body').slideToggle();
            });

            $('.lfgraph-obj').draggable({
                connectToSortable: '.drop-area',
                handle: ".lfgraph-label",
                helper: 'clone',
                revert: 'invalid'
            });

            function updateMap(e) {
                var maps = $(e).find('#gmap_geocoding')[0];
                var addr = $(e).find('#gmap_geocoding_address')[0];
                var data = { "maps": maps, "addr": addr };
                mapGeocoding.init(data);
            }
        }
    };

    var getJson = {
        getFarmInfomation: function () {
            var BASE_API = "http://cs.listenfield.com/WebAPIRequest.jsp";
            var param = {
                Key: "DyZiLXclctLZVtUpQOgESUv7b60",
                Cmd: "GET-FS-DESCRIBE",
                SOSName: "VSOS01.LISTENFIELD",
                FSName: "TOYO-OKA-63051",
                OutputType: "json"
            };
            var val;
            $.ajax({
                type: "get",
                url: BASE_API,
                async: false,
                data: param,
                dataType: "json",
                success: function (data) {
                    val = data.BASEELEMENT.ELEMENT;
                },
                error: function (request, status, errorThrown) {
                    console.log(request.responseText);
                }
            });
            return val;
        }
    }

    // var chartHandler = {
    //     createLineChart: function (canvas) {
    //         var ctx = canvas.getContext('2d');
    //         ctx.canvas.width = 500;
    //         ctx.canvas.height = 250;
    //         var chart = new Chart(ctx, {
    //             type: 'line',
    //             data: {
    //                 labels: ["January", "February", "March", "April", "May", "June", "July"]
    //                 // datasets: [{
    //                 //     label: "My First dataset",
    //                 //     backgroundColor: 'transparent',
    //                 //     borderColor: 'rgb(255, 99, 132)',
    //                 //     data: [0, 10, 5, 2, 20, 30, 45],
    //                 // }]
    //             },
    //             options: {
    //                 scales: {
    //                     yAxes: [{
    //                         ticks: {
    //                             beginAtZero: true
    //                         }
    //                     }]
    //                 }
    //             }
    //         });
    //     }
    // };

    // var createCharts = {
    //     init: function () {
    //         // Create line chart
    //         chartHandler.createLineChart(document.querySelector('.chart-canvas'));
    //     }
    // }

    var mapGeocoding = {
        init: function (data) {
            var map;
            var geocoder = new google.maps.Geocoder();
            var addressPicker = new AddressPicker();
            var val = getJson.getFarmInfomation();

            if (val.Latitude == "" && val.Longitude == "") {
                GMaps.geolocate({
                    success: function (position) {
                        addMapMarker(position.coords.latitude, position.coords.longitude);
                    },
                    error: function (error) {
                        console.log('Geolocation failed: ' + error.message);
                    },
                    not_supported: function () {
                        console.log("Your browser does not support geolocation");
                    }
                });
            } else {
                addMapMarker(val.Latitude, val.Longitude);
                $(data.addr).val(val.Location);
            }

            $(data.addr).typeahead(null, {
                displayKey: 'description',
                source: addressPicker.ttAdapter()
            });

            var handleAction = function () {
                var text = $.trim($(data.addr).val());
                if (text) {
                    map.removeMarkers();
                }
                GMaps.geocode({
                    address: text,
                    callback: function (results, status) {
                        if (status == 'OK') {
                            var latlng = results[0].geometry.location;
                            map.setCenter(latlng.lat(), latlng.lng());
                            map.addMarker({
                                lat: latlng.lat(),
                                lng: latlng.lng(),
                                draggable: true,
                                dragend: function (event) {
                                    var lat = event.latLng.lat();
                                    var lng = event.latLng.lng();
                                    geocoder.geocode({
                                        latLng: event.latLng
                                    }, function (responses) {
                                        if (responses && responses.length > 0) {
                                            event.formatted_address = responses[0].formatted_address;
                                        } else {
                                            event.formatted_address = 'Cannot determine address at this location.';
                                        }
                                        // infowindow.setContent(event.formatted_address + "<br>coordinates: " + event.getPosition().toUrlValue(6));
                                        // infowindow.open(map, event);
                                        $(data.addr).val(event.formatted_address);
                                    });
                                }
                            });
                            //   App.scrollTo($('#gmap_geocoding'));
                        }
                    }
                });
            }
            
            $(data.addr).keypress(function (e) {
                var keycode = (e.keyCode ? e.keyCode : e.which);
                if (keycode == '13') {
                    e.preventDefault();
                    handleAction();
                }
            });

            function addMapMarker(lat, lon) {
                map = new GMaps({
                    div: data.maps,
                    lat: lat,
                    lng: lon,
                });
                map.addMarker({
                    lat: lat,
                    lng: lon,
                    draggable: true,
                    dragend: function (event) {
                        var lat = event.latLng.lat();
                        var lng = event.latLng.lng();
                        geocoder.geocode({
                            latLng: event.latLng
                        }, function (responses) {
                            if (responses && responses.length > 0) {
                                event.formatted_address = responses[0].formatted_address;
                            } else {
                                event.formatted_address = 'Cannot determine address at this location.';
                            }
                            $(data.addr).val(event.formatted_address);
                        });
                    }
                });
                map.setCenter(lat, lon);
            };
        }
    }

    var graphCurrentWeather = {
        init: function (data) {
            s1 = [data.temp];

            plot4 = $.jqplot(data.gra, [s1], {
                seriesDefaults: {
                    renderer: $.jqplot.MeterGaugeRenderer,
                    rendererOptions: {
                        label: data.title,
                        labelPosition: 'bottom',
                        labelHeightAdjust: -5,
                        intervalOuterRadius: 85,
                        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        intervals: [25, 75, 100],
                        intervalColors: ['#66cc66', '#E7E658', '#cc6666']
                    }
                }
            });
        }
    }

    var savePositions = {
        init: function () {
            $('#edit_drop_btn').on('click', function (e) {
                var graphObjects = [];
                $('.drop-area .lfgraph-obj').each(function () {
                    if ($.inArray($(this).attr('data-type'), graphObjects) < 0) {
                        graphObjects.push($(this).attr('data-type'));
                    }
                });
                localStorage.graphObjects = JSON.stringify(graphObjects);
                console.log(localStorage);
            });
        }
    }

    $(document).ready(function () {
        dragHandler.init();
        // createCharts.init();
        // mapGeocoding.init();
        // getJson.init();
    });
});