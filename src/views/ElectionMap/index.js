import React, { Component } from 'react'
import L from 'leaflet'

import constituencyData from './constituencies.json'

class ElectionMap extends Component {
  componentDidMount() {
    if (this.rendered) return false

    const map = L.map('map').setView([ 54, 0 ], 6)

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFjazgyOCIsImEiOiJjanM1enVzdWkwMGszNGFwaGMwN3JnMmVoIn0.r9CfYSdy4rdGFBHO-MJt7w', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
        + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
        + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.light'
    }).addTo(map)


    // control that shows state info on hover
    const info = L.control()

    info.onAdd = () => {
      info.div = L.DomUtil.create('div', 'info')
      info.update()
      return info.div
    }

    info.update = (data) => {
      info.div.innerHTML = `<h4>UK Constituency Map</h4>${(data ? `<b>${data.name}</b><br />${data.density} people / mi<sup>2</sup>` : 'Hover over a constituency')}`
    }

    info.addTo(map)

    // get color depending on value
    const getColor = (d) => {
      if (d > 1000) return '#800026'
      if (d > 500) return '#BD0026'
      if (d > 200) return '#E31A1C'
      if (d > 100) return '#FC4E2A'
      if (d > 50) return '#FD8D3C'
      if (d > 20) return '#FEB24C'
      if (d > 10) return '#FED976'
      return '#FFEDA0'
    }

    const style = feature => ({
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: getColor(feature.properties.density)
    })

    const highlightFeature = (e) => {
      const layer = e.target

      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      })

      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }

      info.update(layer.feature.properties)
    }

    let geojson

    const resetHighlight = (e) => {
      geojson.resetStyle(e.target)
      info.update()
    }

    const zoomToFeature = (e) => {
      map.fitBounds(e.target.getBounds())
    }

    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
    }

    geojson = L.geoJson(constituencyData, {
      style,
      onEachFeature
    }).addTo(map)

    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [ 0, 10, 20, 50, 100, 200, 500, 1000 ]
      const labels = []
      let from
      let to

      for (let i = 0; i < grades.length; i++) {
        from = grades[i]
        to = grades[i + 1]

        labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from} ${(to ? `&ndash; ${to}` : '+')}`)
      }

      div.innerHTML = labels.join('<br>')
      return div
    }

    legend.addTo(map)
    this.rendered = true
  }

  render() {
    return <div id="map" />
  }
}

export default ElectionMap
