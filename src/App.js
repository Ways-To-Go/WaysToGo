import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";


class ShowVoyage extends Component {
	constructor(props) {
		super(props);
		
		this.loadDoc(this); // on recupere le voyage souhaite avec une requete ajax
		
		this.state = {
		  id: props.id,
		  titre: null,
		  toRender: <h1>Chargement en cours...</h1>,
		};
	}
  
	loadDoc(parentVoyage) {
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange=function() {
		if (this.readyState == 4 && this.status == 200) {
			const param = JSON.parse(this.responseText);
			parentVoyage.setState({ toRender : 
				<div id="information">
					<div id="head">
						<h2>{param.title}</h2>
						<p>{param.description}</p>
						<p>{param.vegan ? "Ce voyage est vegan" : "Ce voyage est signalé comme non-vegan"}</p>
						<p>{param.ecological ? "Ce voyage est ecologique" : "Ce voyage est signalé comme non-ecologique"}</p>
						<p>auteur : {param.author.firstName + " " + param.author.lastName}</p>
					</div>
					
					<div id="etapes">
						{param.stages.map((etape) => (
							<div>
								<div class="etape">
									<p class="nomEtape">{etape.description}</p>
									
									<p class="villedate_etape">{etape.city + " • " + new Date(etape.arrival)}</p>
									
									{etape.photos.map((photo) => (
										<div>
											 <img src={photo.path} alt={photo.title} height="150" width="200"></img>
											
											<p>{photo.description}</p>
										</div>
									))}
								</div>
								
								{etape.departureTransport ?
									<div class="transition_etape">
										<p class="transitionTexte">• Moyen de transport : {etape.departureTransport.type}</p>
									</div>
									: ""}
							</div>
						))}
					</div>
				</div>
			});
		}
	  };
	  xhttp.open("GET", "http://wtg.aymerik-diebold.fr/api/trips/"+parentVoyage.props.id, true);
	  xhttp.send();
	}
	
  render() {
	  let content = <div><div>{this.state.toRender}</div></div>;
    return (
	content
    );
  }
}


class ShowCarte extends Component {
  state = {
    lat: 48.856614,
    lng: 2.3522219,
    zoom: 2,
    cities: [
      {
        name: "Paris",
        trips: [
          {
            id: 1,
            city: "Paris",
            title: "My awesome trip",
            desc: "Some info about my awesome trip!",
          },
          {
            id: 3,
            city: "Paris",
            title: "Romance in Paris",
            desc: "Cool trip in Paris",
          },
        ],
        coordinates: [48.856614, 2.3522219],
      },
      {
        name: "Madrid",
        trips: [
          {
            id: 2,
            city: "Madrid",
            title: "Adventure in Madrid",
            desc: "some info",
          },
        ],
        coordinates: [37.7167, -2.1417],
      },
    ],
  };

  getLogoStyle = () => {
    return {
      position: "absolute",
      zIndex: 1,
      left: "40px",
    };
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="App">
        <h1 style={this.getLogoStyle()}>WaysToGo</h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {this.state.cities.map((city) => (
            <Marker position={city.coordinates}>
              <Popup>
                <h1>{city.name}</h1>
                {city.trips.map((trip) => (
                  <div>
                    <h3>
                      <a href={"?show=trip&id=" + trip.id}>{trip.title}</a>
                    </h3>
                    <p>{trip.desc}</p>
                  </div>
                ))}
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}

export default class App extends Component {
	
	constructor(props) {
    super(props);
	
	const urlParams = new URLSearchParams(window.location.search);
    this.state = {
      pageActuelle: urlParams.get('show'), // on recupere la page a afficher via les arguments de l'URL
	  trip: urlParams.get('id'),
    };
  }

  render() {
	  if (this.state.pageActuelle === "trip") {
		  return (<ShowVoyage id={this.state.trip}/>)
	  } else {
		  return (<ShowCarte />)
	  }
  }
}
