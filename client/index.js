var map
let markers = []
let kioskData
let weatherData

// get data from api and load initial map markers
axios
  .get('http://localhost:4000/stations?at=2019-02-16Z07:00:00.000')
  .then(data => {
    kioskData = data.data.kiosks
    weatherData = data.data.weather

    // keep prev window reference so it can be cleared when another is clicked
    let prev_window = false

    // create marker and infowindow for each kios returned from api
    kioskData.forEach(kiosk => {
      let infowindow = new google.maps.InfoWindow({
        content: `
        <div>
          <div>${kiosk.name}</div>
          <div>${kiosk.addressStreet}</div>
          <div>Bikes Available: <span style="color: blue; font-weight: bold;">${
            kiosk.bikesAvailable
          }</span></div>
          <div>Docks open: <span style="color: blue; font-weight: bold;">${
            kiosk.docksAvailable
          }</span></div>
        </div>
        `,
      })

      let coords = new google.maps.LatLng(kiosk.latitude, kiosk.longitude)
      let marker = new google.maps.Marker({
        position: coords,
        label: kiosk.bikesAvailable.toString(10),
        map,
      })
      marker.addListener('click', () => {
        if (prev_window) {
          prev_window.close()
        }
        prev_window = infowindow
        infowindow.open(map, marker)
      })
      markers.push(marker)
    })

    google.maps.event.addListener(map, 'click', () => {
      if (prev_window) {
        prev_window.close()
      }
    })
    // weather setup
    const weatherContainer = document.querySelector('.weatherContainer')
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
      weatherContainer
    )
    const weatherContent = document.createTextNode(`
      ${weatherData.temp}°F - 
      ${weatherData.weather ? weatherData.weather[0].description : null}
    `)
    weather.appendChild(weatherContent)

    const updatedAt = document.getElementById('updatedAt')
    const formattedDate = new Date(weatherData.updatedAt)
    const updatedAtContent = document.createTextNode(
      `Updated at: ${formattedDate}`
    )
    updatedAt.appendChild(updatedAtContent)
    console.log(weatherData)
  })

// map setup
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(39.9524, -75.1636),
    mapTypeId: 'roadmap',
    minZoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
  })

  // searchbar setup
  const input = document.getElementById('search')
  const searchBox = new google.maps.places.SearchBox(input)
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

  map.addListener('bounds_changes', () => {
    searchBox.setBounds(map.getBounds())
  })

  let searchMarkers = []
  searchBox.addListener('places_changed', () => {
    const places = searchBox.getPlaces()

    if (places.length == 0) {
      return
    }

    // clear out last search marker
    searchMarkers.forEach(marker => {
      marker.setMap(null)
    })
    searchMarkers = []

    // set bounds based on place returned from search
    const bounds = new google.maps.LatLngBounds()
    places.forEach(place => {
      if (!place.geometry) {
        console.log('Place has no geometry')
      }

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
      // set marker for each place returned from search
      let marker = new google.maps.Marker({
        position: place.geometry.location,
        title: place.name,
        map,
      })
      searchMarkers.push(marker)
    })
    map.fitBounds(bounds)
  })

  // toggle buttons setup
  const form = document.getElementById('toggleButtons')
  const toggleButtons = new google.maps.places.SearchBox(form)
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(form)

  const bikesAvailable = document.getElementById('bikesAvailable')
  bikesAvailable.addEventListener('click', () => {
    markers.forEach((marker, i) => {
      marker.setLabel({
        text: kioskData[i].bikesAvailable.toString(),
      })
    })
  })

  const openDocks = document.getElementById('openDocks')
  openDocks.addEventListener('click', () => {
    markers.forEach((marker, i) => {
      marker.setLabel({
        text: kioskData[i].docksAvailable.toString(),
      })
    })
  })
}

initMap()
