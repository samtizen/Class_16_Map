/*
 * Google Map API
 * https://developers.google.com/maps/documentation/javascript/tutorial?hl=ru
 * https://developers.google.com/maps/documentation/javascript/examples/place-search?hl=ru
 * https://developers.google.com/maps/documentation/javascript/examples/directions-waypoints?hl=ru
 */

(function(){
	
	var mapMain = {},
		map,
		currPos;
	
	mapMain.init = function() {
		
		// Инициализация карты
		initMap();
		
		// Установка маркера с текущим положением
		setMyPositionOnMap();
		
		// Установка пользовательского стиля карты "Water Style"
		var customMapType = createCustomStyle();
		map.mapTypes.set("water_style", customMapType);
		
		//createWidget();
		
		// Добавление в объект map отслеживания события click
		map.addListener("click", function(e) {
			createMarkerWithLocation(e.latLng, map);
		});
		
	};
	
	/*function createWidget() {
		
		var widget = $("#map-widget")[0];
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(widget);

	}*/
	
	// Создание пользовательского стиля карты
	function createCustomStyle() {
		
		var customMapType = new google.maps.StyledMapType([
		{
			featureType: "water",
			stylers: [{color: "#ffff00"}]
		}
		], {
			name: "Water Style"
		});
		
		return customMapType;
		
	}
	
	// Создание маркера с постоянной позицией
	function createMarkerWithLocation(latLng, map){
		
		var marker = new google.maps.Marker({
			position: latLng,
			map: map
		});
		
		map.panTo(latLng);
		
	}
	
	// Обработчик события drag маркера
	function setPosition_dragEventHandler(pos) {
		
		currPos.lat = pos.latLng.lat();
		currPos.lng = pos.latLng.lng();
		
		console.log(currPos);
	}
	
	// Создание маркера с отслеживанием события drag
	function createMarker(lat, lng) {
		
		console.log(currPos);
		
		var marker = new google.maps.Marker({
			map: map,
			position: {lat: lat, lng: lng},
			/*place: {
				location: {lat: -33.8666, lng: 151.1958},
				query: "my position"
			},*/
		    draggable: true,
		    animation: google.maps.Animation.DROP,
		    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		});
		
	    marker.addListener("drag", setPosition_dragEventHandler);
		
		return marker;
	}

	// Создание информационного окна
	function createInfoWindow() {
		
		var infoWindow = new google.maps.InfoWindow({
			content: "<p style='color:green;'>I'm here</p>"
		});
		
		return infoWindow;
	}
	
	// Прокладывание маршрута
	function setRoute() {
		
		
	}
	
	// Установка маркера с текущим положением
	function setMyPositionOnMap() {
		
		if (navigator.geolocation) {
			
			// Определение текущего положения 
			navigator.geolocation.getCurrentPosition(onsuccessGetPosition, onerrorGetPosition);
			
		} else {

		    console.log("Browser doesn't support geo")
		}
		
		// Выполняется при успешном определении позиции
		function onsuccessGetPosition(pos) {
		    currPos = {
		    		lat: pos.coords.latitude,
		    		lng: pos.coords.longitude
		    	};
		    
		    map.setCenter(currPos); // центрируем карту по позиции currPos
		 
		    setMarkerWithMyPosition(currPos);
		}
		// Выполняется при появлении ошибки при определении позиции
		function onerrorGetPosition(e){
			console.log(e);
		}
	}
	
	// Установка маркера по известным координатам + создаем информ. окно, которое появляется по событию click маркера
	function setMarkerWithMyPosition(currPos) {
		
	    var infoWindow = createInfoWindow();
	    
	    var currMarker = createMarker(currPos.lat, currPos.lng);
		currMarker.addListener("click", function() {
			infoWindow.open(map, currMarker);
		});
	}
	
	// Инициализация карты
	function initMap() {
		var styleArray = [
		      {
		    	  featureType: 'all',
		    	  stylers: [{ saturation: -120 }]
		      },
		      {
		    	  featureType: "water",
		    	  stylers: [{color: "#000000"}]
		      }];
		
		map = new google.maps.Map(document.getElementById("map"), {
			center: {lat: -33.8666, lng: 151.1958},
			zoom: 17,
			scaleControl: false,
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.RIGHT_CENTER
			},
			streetViewControl: false,
			mapTypeControlOptions: {
				mapTypeIds: [
			               google.maps.MapTypeId.ROADMAP, "water_style",
			               google.maps.MapTypeId.SATELLITE
			               ],
			               position: google.maps.ControlPosition.TOP_CENTER
			},
			styles: styleArray
		});
	};
	

	return mapMain;
	
})().init();