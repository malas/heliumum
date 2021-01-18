import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Polyline, Marker } from "react-google-maps";
import { geoToH3, h3ToGeoBoundary, kRing as h3KRing } from 'h3-js';
import NumericInput from 'react-numeric-input';
import data from './data.json';

import yellow_pin from './yellow.png';
import blue_pin from './blue.png';
import purple_pin from './purple.png';
import orange_pin from './orange.png';
import green_pin from './green.png';

// const h3Index = geoToH3(13.067439, 80.237617, 8)
// let hexBoundary = h3ToGeoBoundary(h3Index)
// hexBoundary.push(hexBoundary[0])

function h3ToPolyline(h3idx) {
  let hexBoundary = h3ToGeoBoundary(h3idx)
  hexBoundary.push(hexBoundary[0])

  let arr = []
  for (const i of hexBoundary) {
    arr.push({lat: i[0], lng: i[1]})
  }

  return arr
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getMarker(data) {
  switch(data.owner) {
    case '14Z2WXEAAw4Z32rDvJHNvFQz7tx6maZn8wnrrhmWMMjA32ojiKd':
      // Aleksas
      if (data.address != null) {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/yellow-dot.png`}
        >
        </Marker>;
      } else {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={yellow_pin}
        >
        </Marker>;
      }
    case '14CuUDZ3rXf8W7VBFJc7eB8VBWZ7cAAEDLgAEDkMGpW7U2uMLMk':
      // Švedas
      if (data.address != null) {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/blue-dot.png`}
        >
        </Marker>;
      } else {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={blue_pin}
        >
        </Marker>;
      }
    case '13da4XN3yCbZd6KDNEsmYicPDHDTpZ69s6Esyg4qkbM3rbsUBmz':
      // Andrius
      if (data.address != null) {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/purple-dot.png`}
        >
        </Marker>;
      } else {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={purple_pin}
        >
        </Marker>;
      }
    case '12xrBZUnFJwRwn6vnxtGHDkobyKmDM7JK3oqDf89xdcWtNYwp8G':
      // Dima
      if (data.address != null) {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/orange-dot.png`}
        >
        </Marker>;
      } else {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={orange_pin}
        >
        </Marker>;
      }
    case '13fnZtwwG9nSox7Srk3AtHMqQZ3q4bfdAztmJCR42g7BQoRB4Ym':
      // Erikas
      if (data.address != null) {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/green-dot.png`}
        >
        </Marker>;
      } else {
        return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={green_pin}
        >
        </Marker>;
      }
    default:
      // UNKOWN
      return <Marker
          position={data}
          key={getRandomInt(10000000000)}
          icon={`https://maps.google.com/mapfiles/ms/icons/red-dot.png`}
        >
        </Marker>;
  }
}

window.mapInstance = null

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={13}
    defaultCenter={props.markerPosition}
    ref={el => window.mapInstance = el }
    onClick={props.onClickMap}
  >
  <Marker
    position={props.markerPosition}
    label= {{text: 'Hex centras'}}
    key={getRandomInt(100000000000)}
  >
  </Marker>

  {props.cabPositions != null && props.cabPositions.map(cabPs => (
    getMarker(cabPs)
  ))}
  {
    props.hexagons.map(hex => (
      <Polyline
        key={hex}
        path={h3ToPolyline(hex)}
        options={{strokeColor: '#FF0000', strokeWeight: 2}}
      />
    ))
  }
  </GoogleMap>
))

const defaultCabPositions = data;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      kringSize: 4, 
      lat: 54.686723178237266,
      lng: 25.282520002088617,
      resolution: 7,
      plantingMode: 'RIDER',
      cabPositions: defaultCabPositions
    };

    this.state.riderH3Index = geoToH3(this.state.lat, this.state.lng, this.state.resolution);
    
    this.handleInputChangekRing = this.handleInputChangekRing.bind(this);
    this.handleInputChangeResolution = this.handleInputChangeResolution.bind(this);
    this.handleOnClickMap = this.handleOnClickMap.bind(this);
    this.handleOnClickPlantRider = this.handleOnClickPlantRider.bind(this);
    this.handleOnClickPlantCabs = this.handleOnClickPlantCabs.bind(this);
    this.handleOnClickRemoveCabs = this.handleOnClickRemoveCabs.bind(this);
  }

  handleInputChangekRing(num) {
    this.setState(state => ({
      kringSize: num
    }));
  }

  handleInputChangeResolution(num) {
    this.setState(state => ({
      resolution: num,
      riderH3Index: geoToH3(state.lat, state.lng, num)
    }));
  }

  handleOnClickMap(e) {
    if (this.state.plantingMode === 'RIDER') {
      this.updateRiderMarker(e)
    }

    if (this.state.plantingMode === 'CABS') {
      this.updateCabsMarker(e)
    }
  }

  updateRiderMarker(e) {
    this.setState(state => ({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      riderH3Index: geoToH3(e.latLng.lat(), e.latLng.lng(), state.resolution)
    }));
  }

  updateCabsMarker(e) {
    const newCab = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
      color: 'blue'
    }

    this.setState(state => ({
      cabPositions: [...state.cabPositions, newCab],
    }));
  }
  
  handleOnClickRemoveCabs() {
    this.setState(state => ({
      cabPositions: [],
    }));
  }

  handleOnClickPlantRider() {
    this.setState(state => ({
      plantingMode: 'RIDER'
    }));
  }

  handleOnClickPlantCabs() {
    this.setState(state => ({
      plantingMode: 'CABS'
    }));
  }

  getH3Index() {
    return geoToH3(this.state.lat, this.state.lng, this.state.resolution)
  }

  render() {
    let h3idx = this.getH3Index()
    let apiKey = 'AIzaSyAT8jfo6wpzXcgHbis_GlC87rNDz5aIzQU'
    let mapUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`

    return (
      <div style={{ height: `100%`}} className='d-flex'>
        <div style={{ height: `100%`, width: `100%`}} className='p-2'>
          <MyMapComponent
            isMarkerShown
            googleMapURL={mapUrl}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%`, width: `100%`}} />}
            mapElement={<div style={{ height: `100%` }} />}
            hexagons={h3KRing(h3idx, this.state.kringSize)}
            onClickMap={this.handleOnClickMap}
            markerPosition={{ lat: this.state.lat, lng: this.state.lng }}
            cabPositions={this.state.cabPositions}
          />   
        </div>
        <div style={{paddingRight: '20px'}} className='p-2'>
          <form>
            <div className='form-group'>
              <label>
                Resolution:
              </label>
              <NumericInput className="res_input form-control" min={0} max={30} value={this.state.resolution} onChange={this.handleInputChangeResolution} />
            </div>
            <div className='form-group'>
              <label>
                Ring:
              </label>
              <NumericInput className="num_input form-control" min={0} max={100} value={this.state.kringSize} onChange={this.handleInputChangekRing} />
            </div>
          </form>
          <hr/>
          <div className="custom-control custom-radio">
            <input type="radio" id="customRadio1"
                  name="customRadio" 
                  checked={this.state.plantingMode === 'RIDER'}
                  onChange={this.handleOnClickPlantRider}
                  className="custom-control-input"/>
            <label className="custom-control-label" htmlFor="customRadio1">Replace center</label>
          </div>
          <div className="custom-control custom-radio">
            <input type="radio" id="customRadio2"
                  checked={this.state.plantingMode === 'CABS'}
                  onChange={this.handleOnClickPlantCabs}
                  name="customRadio" className="custom-control-input"/>
            <label className="custom-control-label" htmlFor="customRadio2">Add spot</label>
          </div>
          <button style={{marginTop: `10px`}} onClick={this.handleOnClickRemoveCabs}>
            Remove all spots
          </button>
          <div>
            Markeriai:
            <ul>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" alt=""/> Aleksas
              </li>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt=""/> Švedas
              </li>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/purple-dot.png" alt=""/> Andrius
              </li>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png" alt=""/> Dima
              </li>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" alt=""/> Erikas
              </li>
              <li>
                <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" alt=""/> UNKNOWN
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
