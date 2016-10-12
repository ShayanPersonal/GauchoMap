var weekdayToNum = new Object();
weekdayToNum["ALL"] = 0
weekdayToNum["M"] = 1
weekdayToNum["T"] = 2
weekdayToNum["W"] = 3
weekdayToNum["R"] = 4
weekdayToNum["F"] = 5
weekdayToNum["S"] = 6
weekdayToNum["SUN"] = 7


var weekdays = new Object();
weekdays[0] = "ALL"
weekdays[1] = "M"
weekdays[2] = "T"
weekdays[3] = "W"
weekdays[4] = "R"
weekdays[5] = "F"
weekdays[6] = "S"
weekdays[7] = "SUN"

var map;
var ucsb = {lat: 34.412940, lng: -119.847838};
var infowindow = null;
var currentDate = new Date();
var currentWeekday = currentDate.getDay();
var currentHours = currentDate.getHours();
var currentMinutes = currentDate.getMinutes();
var closestCourse = null;
var smallestDelta = 999;
var markerList = null
var daysList = null
var currentDay = 0
var disclaimer = document.querySelector("#disclaimer")

/*
function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}
*/
/* Incomplete. May be used later

function findDelta(days, time) {
	var daysSplit = days.split(' ')
	var closestDay = null
	var smallestDelta = 999
	for (var i = 0; i < daysSplit.length; i++) {
		day = weekday[daysSplit[i]]
		deltaDay = (day - currentWeekday) % 7
		if (deltaDay < smallestDelta) {
			smallestDelta = deltaDay
			closestDay = day
		}
	}

}
*/

function toggleMarkers(day) {

	if (day == "ALL") {
		for (var i = 0; i < markerList.length; i++) {
			markerList[i].label = markerList[i].courseCount.toString()
			markerList[i].setVisible(true)
			markerList[i].setMap(null)
			markerList[i].setMap(map)
			daysList[currentDay].style.background = "#fff"
			daysList[weekdayToNum[day]].style.background = "#aaa"
			currentDay = weekdayToNum[day]
		}
		return
	}

	for (var i = 0; i < markerList.length; i++) {
		counter = 0
		marker = markerList[i]
		marker.setVisible(true)

		for (var j = 0; j < marker.courseDays.length; j++) {
			if (marker.courseDays[j].indexOf(day) >= 0) {
				counter++
			}
		}

		marker.label = counter.toString()
		if (parseInt(marker.label) == 0) {
			marker.setVisible(false)
		}

		marker.setMap(null)
		marker.setMap(map)

		daysList[currentDay].style.background = "#fff"
		daysList[weekdayToNum[day]].style.background = "#aaa"
		currentDay = weekdayToNum[day]

	}
}

courseArray = JSON.parse(localStorage["courseArray"])

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: ucsb,
    zoom: 15
  });

  var infowindow = new google.maps.InfoWindow({
		content:  "temp"
	});

	markerList = []

	//start making markers
  for (var i = 0; i < courseArray.length; i++) {
  	buildingNames = courseArray[i].courseLocation
  	courseNum = courseArray[i].courseNum

  	//go through the different sections
  	for (var j = 0; j < buildingNames.length; j++) {
  		courseDays = courseArray[i].courseDays[j]
  		courseTimes = courseArray[i].courseTimes[j]

  		//var delta = findDelta(courseDays, courseTimes.split('-')[0])

  		if (j > 0) {
  			courseNum += " Lab / Section"
  		}

  		building = buildingNames[j].split(' ')[0]
  		buildingName = buildingNames[j]
  		fullBuildingName = "Error locating building"
  		coords = {lat: 34.403311, lng: -119.844203}

      match = false

  		//match the building name with buildings.js
  		for (var k = 0; k < building_locations.length; k++) {
  			if (building_locations[k][0].slice(0,building.length) == building) {
  				coords.lat = building_locations[k][2]
  				coords.lng = building_locations[k][3]
  				fullBuildingName = building_locations[k][1]
          match = true
  				break
  			}
  		}

      if (match == false) {
        building = "UNKNOWN"
      }

  		found = false

  		//see if a marker already exists at the bulding
  		for (var k = 0; k < markerList.length; k++) {
  			if (markerList[k].building == building) {
  				markerList[k].courseNums.push(courseNum)
  				markerList[k].courseDays.push(courseDays)
  				markerList[k].courseTimes.push(courseTimes)
  				markerList[k].buildingNames.push(buildingName)
  				markerList[k].label = (parseInt(markerList[k].label) + 1).toString()
  				markerList[k].courseCount += 1
  				found = true
  				break
  			}
  		}

  		if (!found) {
			  var marker = new google.maps.Marker({
			  	//icon: pinSymbol("#FFF"),
			  	building: building,
			  	buildingNames: [buildingName],
			  	fullBuildingName: fullBuildingName,
			    position: coords,
			    label: '1',
			    courseCount: 1,
			    map: map,
			    title: 'Course Description',
			    courseNums: [courseNum],
			    courseDays: [courseDays],
			    courseTimes: [courseTimes]
			  });
			  
			  marker.addListener('click', function() {
			  	var content = "<b style='font-size: 1.3em;'>" + this.fullBuildingName + "</b>"
			  	content += "<br />"

			  	//go through different courses at this location
			  	for (var k = 0; k < this.courseNums.length; k++) {
			  		content += "<br />" + "<b>" + this.courseNums[k] + "</b>"
			  		content += "<br />" + "<span style='color: #1d00ff; font-weight: 600'>Room: </span>" + this.buildingNames[k]
			  		content += "<br />" + "<span style='color: #1d00ff; font-weight: 600'>Days: </span>" + this.courseDays[k]
			  		content += "<br />" + "<span style='color: #1d00ff; font-weight: 600'>Time: </span>" + this.courseTimes[k]
			  		content += "<br />"
			  	}

			  	content += "<br />" + "Click for <a href = 'http://mapdev.geog.ucsb.edu/'> UCSB Interactive Map</a>"

			  	infowindow.setContent(content)
			    infowindow.open(map, this);
			  });  

        marker.addListener('click', function() {
          disclaimer.style.display = 'none';
        });

			  markerList.push(marker)
		  }	
		}
  }

  daysList = document.querySelectorAll("#control-box li")

  for (var i = 0; i < daysList.length; i++) {
  	if (i == 0) {
  		daysList[i].style.background = "#aaa"
  	}
  	daysList[i].day = weekdays[i]
  	daysList[i].addEventListener('click', function() { toggleMarkers(this.day) })
  }

  //closeDisclaimer = document.querySelector("#close-disclaimer")
  //disclaimer = document.querySelector("#disclaimer")
  //closeDisclaimer.addEventListener('click', function() { disclaimer.style.cssText += "display: none;"})

}