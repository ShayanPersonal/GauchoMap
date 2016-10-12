function createMap() {
  chrome.runtime.sendMessage({greeting: "createMap", courseArray: courseArray}, function(response) {
});
}

var myClassSchedule = document.querySelector('div[id="content"] h3');
var openMapBtn = document.createElement('button');
openMapBtn.innerHTML = '<b>Open Map</b>';
openMapBtn.id = "openMapBtn";
openMapBtn.addEventListener("click", createMap, false);
myClassSchedule.parentElement.insertAdjacentElement('afterbegin', openMapBtn);

courseArray = []

var courseLabelId = "pageContent_CourseList_CourseHeadingLabel_"
var courseLabelAltId = "pageContent_CourseList_CourseHeadingLabelAlternate_"
var meetingPlaceId = "pageContent_CourseList_MeetingTimesList_X_HyperLinkBuildingLocation_Y"
var meetingPlaceAltId = "pageContent_CourseList_MeetingTimesList_X_HyperLinkBuildingLocationAlt_Y"
var meetingTimesId = "pageContent_CourseList_MeetingTimesList_"

var i = 0
var currentCourse = document.getElementById(courseLabelId + i) || document.getElementById(courseLabelAltId + i)
var currentLocation = null

//loop through schedule and create objects

while (currentCourse != null) {
  var courseObject = { courseNum: null, courseName: null, courseLocation: [], courseDays: [], courseTimes: []}
  var courseTitle = currentCourse.innerHTML.replace(/&nbsp;/g,'').trim()

  currentLocation = document.getElementById(meetingPlaceId.replace("X", i).replace("Y", "0")) || document.getElementById(meetingPlaceAltId.replace("X", i).replace("Y", "0"))

  courseTitleSplit = courseTitle.split('-')
  courseName = courseTitleSplit[1]
  courseNum = courseTitleSplit[0]

  courseObject.courseNum = courseNum
  courseObject.courseName = courseName

  //loop through sections

  var j = 1
  while (currentLocation != null) {
    locationName = currentLocation.innerHTML.replace(/&nbsp;/g,'').trim()
    courseObject.courseLocation.push(locationName)
    //console.log(locationName)
    currentLocation = document.getElementById(meetingPlaceId.replace("X", i).replace("Y", j)) || document.getElementById(meetingPlaceAltId.replace("X", i).replace("Y", j))
    j += 1
  }

  //loop through times
  var meetingTimesId = "pageContent_CourseList_MeetingTimesList_"
  meetingTimesBox = document.getElementById(meetingTimesId + i)
  meetingTimesCells = meetingTimesBox.querySelectorAll(".clcellprimary")

  //have to do use this rather than ||
  if (meetingTimesCells.length == 0) {
    meetingTimesCells = meetingTimesBox.querySelectorAll(".clcellprimaryalt")
  }

  for (var k = 0; k < meetingTimesCells.length/3; k++) {
    days = meetingTimesCells[k*3].innerHTML.replace(/&nbsp;/g,'').trim()
    times = meetingTimesCells[k*3 + 1].innerHTML.replace(/&nbsp;/g,'').trim()
    courseObject.courseDays.push(days)
    courseObject.courseTimes.push(times)
  }

  courseArray.push(courseObject)
  i += 1
  currentCourse = document.getElementById(courseLabelId + i) || document.getElementById(courseLabelAltId + i)
}