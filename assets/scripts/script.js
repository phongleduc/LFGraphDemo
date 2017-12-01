$(function () {

    var dragHandler = {
        objectIndex: 0,
        init: function () {
            // Drag graph
            var dropArea = $('.drop-area');

            // Append html on drop area on pageload
            savePositions.init();
            debugger
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
                            case "5":
                                updateBarChart(dropArea);
                                break;
                            case "1":
                                dragHandler.renderGau('.daily_average_air_temperature_class');
                                break;
                            case "2":
                                dragHandler.renderGau('.daily_maximum_air_temperature_class');
                                break;
                            case "3":
                                dragHandler.renderGau('.daily_minimum_air_temperature_class');
                                break;
                            case "6":
                                pieChartHandler.renderChart();
                                break;
                            case "7":
                                areaChartHandler.renderChart();
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
                    debugger
                    var target = $(event.toElement).closest('.lfgraph-obj');
                    target.addClass('received');
                    target.attr('data-index', dragHandler.objectIndex);
                    dragHandler.objectIndex++;
                    target.attr('id', 'graph-' + dragHandler.objectIndex++);
                    var check = $(event.toElement).attr('id');
                    switch (check) {
                        case "maps":
                            updateMap(target);
                            break;

                        case "daily_maximum_air":
                            dragHandler.renderGau('.daily_maximum_air_temperature_class', target);
                            break;
                        case "daily_average_air":
                            dragHandler.renderGau('.daily_average_air_temperature_class', target);
                            break;
                        case "daily_minimum_air":
                            dragHandler.renderGau('.daily_minimum_air_temperature_class', target);
                            break;
                        case "farm_info":
                            farmInformationHandler.init();
                        case "bar-chart-precipitation":
                            //do something
                            barChartPreHandler.renderBarChart();
                        case "pie-chart-precipitation":
                            pieChartHandler.renderChart();
                            break;
                        case "area-chart-precipitation":
                            areaChartHandler.renderChart();
                            break;
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
                var data = {"maps": maps, "addr": addr, "clr": clr};
                mapGeocoding.init(data);
            }

            function updateBarChart(e) {
                barChartPreHandler.renderBarChart();
            }
        },
        renderGau: function (className, target) {
            debugger
            var gra = $(target).find('.plot-chart')[0].id;
            //get api
            var temp = Math.round(Math.random() * 100);//$(target).find('.plot-chart .temp-num').val();
            var title = className;//$(target).find('.plot-chart .temp-title').val();
            //var data = {"gra": gra, "temp": temp, "title": title};
            graphCurrentWeather.init(className, temp, title);
        }

    };
    var pieChartHandler = {
        renderChart: function () {
            var dataChar2 = [
                ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14],
                ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
            ];
            var plot1 = $('.chartPiePrecipitation').jqplot([[['a',25],['b',14],['c',7]]], {
                gridPadding: {top:0, bottom:38, left:0, right:0},
                seriesDefaults:{
                    renderer:$.jqplot.PieRenderer,
                    trendline:{ show:false },
                    rendererOptions: { padding: 8, showDataLabels: true }
                },
                legend:{
                    show:true,
                    placement: 'outside',
                    rendererOptions: {
                        numberRows: 1
                    },
                    location:'s',
                    marginTop: '15px'
                }
            });
        }
    };
    var areaChartHandler = {
        renderChart : function () {
            var datas = {
                "rural": [0.9176, 0.9296, 0.927, 0.9251, 0.9241, 0.9225, 0.9197, 0.9164, 0.9131, 0.9098, 0.9064, 0.9028, 0.8991, 0.8957, 0.8925, 0.8896, 0.8869, 0.8844, 0.882, 0.8797, 0.8776, 0.8755, 0.8735, 0.8715, 0.8696, 0.8677, 0.8658, 0.8637, 0.8616, 0.8594, 0.8572, 0.8548, 0.8524, 0.8499, 0.8473, 0.8446, 0.8418, 0.8389, 0.8359, 0.8328, 0.8295, 0.8262, 0.8227, 0.8191, 0.8155, 0.8119, 0.8083, 0.8048, 0.8013, 0.7979, 0.7945, 0.7912, 0.7879, 0.7846, 0.7813, 0.778, 0.7747, 0.7714, 0.768, 0.7647, 0.7612, 0.7577, 0.7538, 0.7496, 0.7449, 0.7398, 0.7342, 0.7279, 0.721, 0.7137, 0.7059, 0.6977, 0.6889, 0.6797, 0.6698, 0.6593, 0.6482, 0.6367, 0.6247, 0.6121, 0.5989, 0.5852, 0.571, 0.5561, 0.5402, 0.5232, 0.505, 0.4855, 0.4643, 0.4414, 0.4166, 0.3893, 0.3577, 0.3204, 0.2764, 0.2272, 0.1774, 0.1231, 0.0855, 0.0849],
                "urban": [0.0824, 0.0704, 0.073, 0.0749, 0.0759, 0.0775, 0.0803, 0.0836, 0.0869, 0.0902, 0.0936, 0.0972, 0.1009, 0.1043, 0.1075, 0.1104, 0.1131, 0.1156, 0.118, 0.1203, 0.1224, 0.1245, 0.1265, 0.1285, 0.1304, 0.1323, 0.1342, 0.1363, 0.1384, 0.1406, 0.1428, 0.1452, 0.1476, 0.1501, 0.1527, 0.1554, 0.1582, 0.1611, 0.1641, 0.1672, 0.1705, 0.1738, 0.1773, 0.1809, 0.1845, 0.1881, 0.1917, 0.1952, 0.1987, 0.2021, 0.2055, 0.2088, 0.2121, 0.2154, 0.2187, 0.222, 0.2253, 0.2286, 0.232, 0.2353, 0.2388, 0.2423, 0.2462, 0.2504, 0.2551, 0.2602, 0.2658, 0.2721, 0.279, 0.2863, 0.2941, 0.3023, 0.3111, 0.3203, 0.3302, 0.3407, 0.3518, 0.3633, 0.3753, 0.3879, 0.4011, 0.4148, 0.429, 0.4439, 0.4598, 0.4768, 0.495, 0.5145, 0.5357, 0.5586, 0.5834, 0.6107, 0.6423, 0.6796, 0.7236, 0.7728, 0.8226, 0.8769, 0.9145, 0.9151]
            };
            var labels = ['Rural', 'Urban'];
            var plot3 = $('.chartAreaPrecipitation').jqplot([datas.rural, datas.urban], {
                title: 'Contribution of Urban and Rural Population to National Percentiles (edited data)',
                stackSeries: true,
                seriesColors: ['#77933C', '#B9CDE5'],
                seriesDefaults: {
                    showMarker: false,
                    fill: true,
                    fillAndStroke: true
                },
                legend: {
                    show: true,
                    renderer: $.jqplot.EnhancedLegendRenderer,
                    rendererOptions: {
                        numberRows: 1
                    },
                    placement: 'outsideGrid',
                    labels: labels,
                    location: 's'
                },
                axes: {
                    xaxis: {
                        pad: 0,
                        min: 1,
                        max: 100,
                        label: '',//'Population Percentile',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                        tickInterval: 3,
                        tickOptions: {
                            showGridline: false
                        }
                    },
                    yaxis: {
                        min: 0,
                        max: 1,
                        label: '',//'Percentage of Population',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                        tickOptions: {
                            formatter: $.jqplot.PercentTickFormatter,
                            showGridline: false,
                            formatString: '%d%%'
                        }
                    }
                },
                grid: {
                    drawBorder: false,
                    shadow: false,
                    // background: 'rgba(0,0,0,0)'  works to make transparent.
                    background: 'white'
                }
            });
        }
    };
    
    var barChartPreHandler = {
        renderBarChart: function () {
            //get api
            var arrPreJson = [{'date': '27/11', 'data': 2}, {'date': '28/11', 'data': 6}, {
                'date': '29/11',
                'data': 7
            }, {'date': '30/11', 'data': 3},
                {'date': '01/12', 'data': 11}, {'date': '02/12', 'data': 5.2}, {'date': '03/12', 'data': 10}];

            var s1 = [];
            var ticks = [];

            $.each(arrPreJson, function (key, value) {
                s1.push(value.data);
                ticks.push(value.date);
            });
            $.jqplot.config.enablePlugins = true;
            plot1 = $(".chartBarPrecipitation").jqplot([s1], {
                // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
                animate: !$.jqplot.use_excanvas,
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    pointLabels: {show: true}
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer,
                        ticks: ticks
                    }
                },
                highlighter: {show: false}
            });
            //
            // $('#charttesttt').bind('jqplotDataClick',
            //     function (ev, seriesIndex, pointIndex, data) {
            //         $('#info1ff').html('series: ' + seriesIndex + ', point: ' + pointIndex + ', data: ' + data);
            //     }
            // );

            // var line1 = [['Nissan', 4],['Porche', 6],['Acura', 2],['Aston Martin', 5],['Rolls Royce', 6]];
            //
            // $('.chartBarPrecipitation').jqplot([line1], {
            //     title:'Precipitation Chart on week',
            //     seriesDefaults:{
            //         renderer:$.jqplot.BarRenderer
            //     },
            //     axes:{
            //         xaxis:{
            //             renderer: $.jqplot.CategoryAxisRenderer
            //         }
            //     }
            // });
        }
    };
    var getJson = {
        BASE_API: "http://cs.listenfield.com/WebAPIRequest.jsp",
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
        init: function (className, temp, title) {
            s1 = [temp];

            plot4 = $(className).jqplot([s1], {
                seriesDefaults: {
                    renderer: $.jqplot.MeterGaugeRenderer,
                    rendererOptions: {
                        label: title + ' ' + temp,
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
    };

    var savePositions = {
        init: function () {
            $('#edit_drop_btn').on('click', function (e) {
                debugger
                var graphObjects = [];
                $('.drop-area .lfgraph-obj').each(function () {
                    debugger
                    if ($.inArray($(this).attr('data-type'), graphObjects) < 0) {
                        graphObjects.push($(this).attr('data-type'));
                    }
                });
                localStorage.graphObjects = JSON.stringify(graphObjects);
                //console.log(localStorage);
                //show model
                //$('#modalShowMessageSave').modal('toggle');
                $('#modalShowMessageSave').modal('show');
                //$('#modalShowMessageSave').modal('hide');
                setTimeout(function () {
                    $('#modalShowMessageSave').modal('hide');
                }, 1200);
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

            var farmInforCookiesObj = this.getCookies("FarmCookiesName");
            if (farmInforCookiesObj == null) {
                var val = getJson.getDataMap();

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
        getCookies: function (name) {
            var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
            result && (result = JSON.parse(result[1]));
            return result;
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
        // getJson.getFarmInfomation();
        // createCharts.init();
        // mapGeocoding.init();
        // getJson.init();
    });
});
