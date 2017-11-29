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
                            var data = {"gra": gra, "temp": temp, "title": title};
                            graphCurrentWeather.init(data);
                            break;

                        case "farm_info":
                            getJson.getFarmInfomation();

                        default:
                            break;
                    }
                }
            }).disableSelection();

            // Remove icon
            $('body').on('click', '.remove-btn', function (e) {
                e.preventDefault();
                $(this).closest('.lfgraph-obj').remove();
            });
            // Edit icon
            $('body').on('click', '.edit-btn', function (e) {
                e.preventDefault();
                var tag = $(this).closest('.lfgraph-obj');

                tag.find('.content-body .form-control-static').addClass("hidden");
                tag.find('.content-body #farm-info textarea').removeClass("hidden");
                tag.find('.content-body #farm-info input').removeClass("hidden");
                tag.find('.content-body #farm-info select').removeClass("hidden");
                tag.find('.content-body #farm-info button').removeClass("hidden");

            });
            // Minimize icon
            $('body').on('click', '.minimize-btn', function (e) {
                e.preventDefault();
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
                var clr = $(e).find('.clear-btn')[0];
                var data = { "maps": maps, "addr": addr, "clr": clr };
                mapGeocoding.init(data);
            }
        }

    };

    var getJson = {
        BASE_API : "http://cs.listenfield.com/WebAPIRequest.jsp",
        getCookies: function (name) {
            var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
            result && (result = JSON.parse(result[1]));
            return result;
        },
        getFarmInfomation: function () {
            var farmInforCookiesObj = this.getCookies("FarmCookiesName");
            if (farmInforCookiesObj == null) {
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
                    url: getJson.BASE_API,
                    async: false,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        var val = data.BASEELEMENT.ELEMENT;
                        $(".sos_group p").text(val.Group);
                        $(".sos_select").val(val.Group);
                        $(".sos_name p").text(val.NAME);
                        $(".sos-name-input").val(val.NAME);
                        $(".sos_queue p").text(val.Model);
                        $(".sos-queue-input").val(val.Model);
                        $(".ping_inter p").text(val.FeedInterval);
                        $(".ping-inter-input").val(val.FeedInterval);
                        $(".location p").text(val.Location);
                        $(".location-input").val(val.Location);
                        $(".altitude p").text(val.Altitude);
                        $(".altitude-input").val(val.Altitude);
                        $(".latitude p").text(val.Latitude);
                        $(".latitude-input").val(val.Latitude);
                        $(".longitude p").text(val.Longitude);
                        $(".longitude-input").val(val.Longitude);
                        $(".monitor_stt p").text(val.IsMonitored == "Y" ? "Monitored" : "Freedom");
                        $(".monitor-stt-select").val(val.IsMonitored == "Y" ? "Monitored" : "Freedom");
                        $(".platform-type-input").val(val.Type);
                        $(".platformType p").text(val.Type);
                        $(".description p").text(val.Description);
                        $(".description-input").text(val.Description);

                    },
                    error: function (err) {
                        console.log(jqXHR.responseText);
                    }
                });

            } else {
                $(".sos_group p").text(farmInforCookiesObj.sosGroup);
                $(".sos_select").val(farmInforCookiesObj.sosGroup);
                $(".sos_name p").text(farmInforCookiesObj.sosName);
                $(".sos-name-input").val(farmInforCookiesObj.sosName);
                $(".sos_queue p").text(farmInforCookiesObj.sosQueue);
                $(".sos-queue-input").val(farmInforCookiesObj.sosQueue);
                $(".ping_inter p").text(farmInforCookiesObj.pingInter);
                $(".ping-inter-input").val(farmInforCookiesObj.pingInter);
                $(".location p").text(farmInforCookiesObj.location);
                $(".altitude p").text(farmInforCookiesObj.altitude);
                $(".altitude-input").val(farmInforCookiesObj.altitude);
                $(".latitude p").text(farmInforCookiesObj.latitude);
                $(".latitude-input").val(farmInforCookiesObj.latitude);
                $(".longitude p").text(farmInforCookiesObj.longitude);
                $(".longitude-input").val(farmInforCookiesObj.longitude);
                $(".monitor_stt p").text(farmInforCookiesObj.monitorStt == "Y" ? "Monitored" : "Freedom");
                $(".monitor-stt-select").val(farmInforCookiesObj.monitorStt == "Y" ? "Monitored" : "Freedom");
                $(".platform-type-input").val(farmInforCookiesObj.platformType);
                $(".platformType p").text(farmInforCookiesObj.platformType);
                $(".description p").text(farmInforCookiesObj.description);
                $(".description-input").text(farmInforCookiesObj.description);
                $(".ipAddr p").text(farmInforCookiesObj.ipAddr);
                $(".ip-addr-input").val(farmInforCookiesObj.ipAddr);
            }
        },
        getDataMap: function () {
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
                url: getJson.BASE_API,
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

    var mapGeocoding = {
        init: function (data) {
            var map;
            var geocoder = new google.maps.Geocoder();
            var addressPicker = new AddressPicker();
            var val = getJson.getDataMap();

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
                                        $(data.clr).removeClass('hidden');
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
                            $(data.clr).removeClass('hidden');
                        });
                    }
                });
                map.setCenter(lat, lon);
            };

            function checkForInput(element) {
                if ($(element).val().length > 0) {
                    $(data.clr).removeClass('hidden');
                }
            }

            $(data.clr).click(function () {
                $(this).addClass('hidden');
            });

            $(data.addr).each(function () {
                checkForInput(this);
            });

            $(data.addr).on('change keyup', function () {
                checkForInput(this);
            });
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

    var farmInformationHandler = {
        init: function () {
            // Apply button
            $('body').on('click', '.apply-btn', function (e) {
                e.preventDefault();
                farmInformationHandler.farmInforApply($(this), 0);
            });
        },
        farmInforApply: function (btn, isSave) {
            //validation form
            var farmIsvalid = farmInformationHandler.ValidationForm(btn, isSave);
            if (!farmIsvalid) {
                return farmIsvalid;
            }

            $('.content-body .form-control-static').removeClass("hidden");
            $('.content-body #farm-info textarea').addClass("hidden");
            $('.content-body #farm-info input').addClass("hidden");
            $('.content-body #farm-info select').addClass("hidden");
            $('.content-body #farm-info button').addClass("hidden");
            $('.ipAddrTitle').show();
            //$('.show-message-apply').show();

            return farmInformationHandler.ApplyClickFarmInfor(btn, isSave);
        },
        ValidationForm: function (btn, isSave) {
            var isValid = true;
            var form = btn.closest('form');
            if (!farmInformationHandler.ValidEle(form.find('.sos-name-input')[isSave], false)
                // || !farmInformationHandler.ValidEle($('#ip-addr')[0], false)
                || !farmInformationHandler.ValidEle($('.latitude-input')[isSave], true)
                || !farmInformationHandler.ValidEle($('.longitude-input')[isSave], true)
                || !farmInformationHandler.ValidEle($('.altitude-input')[isSave], false)
                || !farmInformationHandler.ValidEle($('.location-input')[isSave], false)
                || !farmInformationHandler.ValidEle($('.sos-queue-input')[isSave], false)
                || !farmInformationHandler.ValidEle($('.ping-inter-input')[isSave], false)) {
                isValid = false;
            }
            return isValid;
        },
        ValidEle: function (element, isnumber) {
            var isValid = true;
            if (!isnumber) {
                if (!element.value) {
                    element.style.border = "solid 1px #DF013A";
                    isValid = false;
                } else {
                    element.style.border = "solid 1px #ced4da";
                }
            } else {
                if (parseFloat(element.value) == NaN) {
                    element.style.border = "solid 1px #DF013A";
                    isValid = false;
                } else {
                    element.style.border = "solid 1px #ced4da";
                }
            }
            return isValid;
        },
        GetValueEle: function (idElement) {
            return document.getElementById(idElement);
        },
        ApplyClickFarmInfor: function (btn, isSave) {
            var form = btn.closest('form');
            var farmInforObj = {
                'sosName': form.find('.sos-name-input')[isSave].value,
                'sosGroup': form.find('.sos_select')[isSave].value,
                'ipAddr': form.find('.ip-addr-input')[isSave].value,
                'description': form.find('.description-input')[isSave].value,
                'latitude': form.find('.latitude-input')[isSave].value,
                'longitude': form.find('.longitude-input')[isSave].value,
                'altitude': form.find('.altitude-input')[isSave].value,
                'location': form.find('.location-input')[isSave].value,
                'sosQueue': form.find('.sos-queue-input')[isSave].value,
                'pingInter': form.find('.ping-inter-input')[isSave].value,
                'monitorStt': form.find('.monitor-stt-select')[isSave].value,
                'platformType': form.find('.platform-type-input')[isSave].value
            }

            $(".sos_group p").text(farmInforObj.sosGroup);
            $(".sos_select").val(farmInforObj.sosGroup);
            $(".sos_name p").text(farmInforObj.sosName);
            $(".sos-name-input").val(farmInforObj.sosName);
            $(".sos_queue p").text(farmInforObj.sosQueue);
            $(".sos-queue-input").val(farmInforObj.sosQueue);
            $(".ping_inter p").text(farmInforObj.pingInter);
            $(".ping-inter-input").val(farmInforObj.pingInter);
            $(".location p").text(farmInforObj.location);
            $(".altitude p").text(farmInforObj.altitude);
            $(".altitude-input").val(farmInforObj.altitude);
            $(".latitude p").text(farmInforObj.latitude);
            $(".latitude-input").val(farmInforObj.latitude);
            $(".longitude p").text(farmInforObj.longitude);
            $(".longitude-input").val(farmInforObj.longitude);
            $(".monitor_stt p").text(farmInforObj.monitorStt == "Y" ? "Monitored" : "Freedom");
            $(".monitor-stt-select").val(farmInforObj.monitorStt == "Y" ? "Monitored" : "Freedom");
            $(".platform-type-input").val(farmInforObj.platformType);
            $(".platformType p").text(farmInforObj.platformType);
            $(".description p").text(farmInforObj.description);
            $(".description-input").text(farmInforObj.description);
            $(".ipAddr p").text(farmInforObj.ipAddr);
            $(".ip-addr-input").val(farmInforObj.ipAddr);

            return farmInforObj;
        },
        fISave: function (cname, cvalue, exdays) {
            //expire old cookies
            UtilitiesGlobal.setCookies(cname, cvalue, -1);
            //save farm infor to cookies
            UtilitiesGlobal.setCookies(cname, cvalue, exdays);
        },
        getCookies: function (name) {
            return UtilitiesGlobal.getCookies(name);
        },
        fISaveInit: function () {
            var checkValid = farmInformationHandler.farmInforApply($('.apply-btn'), 1);
            if (!checkValid) {
                return checkValid;
            }
            $('.show-message-apply').show().hide(3000);
            farmInformationHandler.fISave(farmInformationHandler.GetNameCookies(), checkValid, 1);
        },
        GetNameCookies: function () {
            return "FarmCookiesName";
        }
    };

    var UtilitiesGlobal = {
        setCookies: function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));//* 24
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + JSON.stringify(cvalue) + ";" + expires + ";path=/";
        },
        getCookies: function (name) {
            var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
            result && (result = JSON.parse(result[1]));
            return result;
        }
    };

    $(document).ready(function () {
        dragHandler.init();
        farmInformationHandler.init();
        getJson.getFarmInfomation();
        // createCharts.init();
        // mapGeocoding.init();
        // getJson.init();

        //request ajax get api bind to Farm information
        $('.show-message-apply').hide();
    });
});
