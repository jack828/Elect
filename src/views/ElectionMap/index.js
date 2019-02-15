import React, { Component } from 'react'
import L from 'leaflet'

// TODO: improve loading by using https://docs.mapbox.com/studio-manual/reference/datasets/
import constituencyData from './constituencies.json'

class ElectionMap extends Component {
  componentDidMount() {
    if (!this.map) this.renderMap()
  }

  getColour(val) {
    if (val > 1000) return '#800026'
    if (val > 500) return '#BD0026'
    if (val > 200) return '#E31A1C'
    if (val > 100) return '#FC4E2A'
    if (val > 50) return '#FD8D3C'
    if (val > 20) return '#FEB24C'
    if (val > 10) return '#FED976'
    return '#FFEDA0'
  }

  renderMap() {
    this.map = L.map('map').setView([ 54, -2 ], 6)

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFjazgyOCIsImEiOiJjanM1enVzdWkwMGszNGFwaGMwN3JnMmVoIn0.r9CfYSdy4rdGFBHO-MJt7w', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, '
        + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
        + 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.light'
    }).addTo(this.map)

    // control that shows state info on hover
    this.info = L.control()

    this.info.onAdd = () => {
      this.info.div = L.DomUtil.create('div', 'info')
      this.info.update()
      return this.info.div
    }

    this.info.update = (data) => {
      this.info.div.innerHTML = `<h4>UK Constituency Map</h4>${(data ? `<b>${data.name}</b><br />` : 'Hover over a constituency')}`
    }

    this.info.addTo(this.map)

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

      this.info.update(layer.feature.properties)
    }

    const resetHighlight = (e) => {
      this.geojson.resetStyle(e.target)
      this.info.update()
    }

    const zoomToFeature = (e) => {
      this.map.fitBounds(e.target.getBounds())
    }

    const onEachFeature = (feature, layer) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
    }

    const style = feature => ({
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: this.getColour(feature.properties.density)
    })

    this.geojson = L.geoJson(constituencyData, {
      style,
      onEachFeature
    }).addTo(this.map)

    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend')
      const grades = [ 0, 10, 20, 50, 100, 200, 500, 1000 ]
      const labels = []

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i]
        const to = grades[i + 1]

        labels.push(`<i style="background:${this.getColour(from + 1)}"></i> ${from} ${(to ? `&ndash; ${to}` : '+')}`)
      }

      div.innerHTML = labels.join('<br>')
      return div
    }

    legend.addTo(this.map)
  }

  render() {
    return <div id="map" />
  }
}

export default ElectionMap
