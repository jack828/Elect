import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'

// TODO: improve loading by using https://docs.mapbox.com/studio-manual/reference/datasets/
class ElectionMap extends Component {
  constructor(props) {
    super(props)
    const { election } = this.props
    const { parties, votes } = election
    this.election = election
    this.parties = parties
    this.votes = votes

    this.handleVote = this.handleVote.bind(this)
  }

  componentDidMount() {
    if (!this.map) this.renderMap()
    if (!this.constituencyData) this.loadConstituencyData()
    this.props.websocket.on('vote:cast', this.handleVote)
  }

  componentWillUnmount() {
    this.props.websocket.off('vote:cast', this.handleVote)
  }

  getTopPartyColour({ slug }) {
    const constituencyVotes = this.votes[slug]

    // No votes cast for that constituency
    if (!constituencyVotes) return 'white'

    const [ topParty, ...otherParties ] = Object.keys(constituencyVotes)
      .reduce((ordered, partyId) => [
        ...ordered,
        { partyId, votes: constituencyVotes[partyId] }
      ], [])
      .sort((a, b) => b.votes - a.votes)

    // check for ties
    if (topParty && otherParties[0] && topParty.votes === otherParties[0].votes) {
      return 'white'
    }

    // Spoilt ballots
    if (topParty.partyId === 'null') return 'black'

    const party = this.parties.find(({ _id }) => topParty.partyId === _id)
    return party.colour
  }

  handleVote({ vote: { constituencySlug, party } }) {
    if (!this.votes[constituencySlug]) {
      this.votes[constituencySlug] = {}
    }
    if (!this.votes[constituencySlug][party]) {
      this.votes[constituencySlug][party] = 0
    }

    this.votes[constituencySlug][party]++

    // update the layer's colour
    this.constituencyGeoJson.eachLayer((layer) => {
      const { feature: { properties: { slug } } } = layer
      if (constituencySlug === slug) {
        layer.setStyle({
          fillColor: this.getTopPartyColour({ slug })
        })
      }
    })
  }

  async loadConstituencyData() {
    // Not in redux due to size
    try {
      this.constituencyData = await this.props.websocket.send('constituencies:load')
      this.addConstituencyData()
    } catch (error) {
      console.error('Error loading constituency data', error)
    }
  }

  addConstituencyData() {
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
      this.constituencyGeoJson.resetStyle(e.target)
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
      fillColor: this.getTopPartyColour(feature.properties)
    })

    this.constituencyGeoJson = L.geoJson(this.constituencyData, {
      style,
      onEachFeature
    }).addTo(this.map)

    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'info legend')

      const labels = this.parties.map(party => `<i style="background:${party.colour};"></i> ${party.name}`)

      labels.push('<i style="background: black;"></i> Spoilt Ballot')
      div.innerHTML = labels.join('<br>')
      return div
    }

    legend.addTo(this.map)
  }

  renderInfoContent(data) {
    const base = `<h4>${this.election.name}</h4>`
    let content
    if (!data) {
      content = 'Hover over a constituency'
    } else {
      const constituencyVotes = this.votes[data.slug] || {}

      const results = Object.keys(constituencyVotes).map((partyId) => {
        if (partyId === 'null') {
          return { votes: constituencyVotes.null, text: `<li>Spoilt ballot: ${constituencyVotes.null}</li>` }
        }
        const party = this.parties.find(({ _id }) => partyId === _id)
        return {
          votes: constituencyVotes[partyId],
          text: `<li>${party.name}: ${constituencyVotes[partyId]}</li>`
        }
      })
        .sort((a, b) => b.votes - a.votes)
        .map(({ text }) => text)

      content = `
        <b>${data.name}</b>
        <br />
        <ul>
          ${results.join('')}
        </ul>
        <p></p>
      `
    }
    return `${base}${content}`
  }

  renderMap() {
    this.map = L.map('map').setView([ 54.5, -2 ], 6)

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
      this.info.div.innerHTML = this.renderInfoContent(data)
    }

    this.info.addTo(this.map)
  }

  render() {
    return <div id="map" />
  }
}

ElectionMap.propTypes = {
  websocket: PropTypes.object.isRequired,
  election: PropTypes.shape({
    name: PropTypes.string.isRequired,
    parties: PropTypes.array.isRequired,
    votes: PropTypes.object.isRequired
  }).isRequired
}

export default ElectionMap
