import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { OpenStreetMapProvider } from 'leaflet-geosearch';


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
	constructor(props) {
		super(props);
		
		this.state = {
		  liste_voyage: [],
		  villes: ["Paris", "Madrid"],

		  lat: 48.856614,
		  lng: 2.3522219,
		  zoom: 2
		};
		
		const provider = new OpenStreetMapProvider();
		{this.state.villes.map((city) => (
		  provider
			  .search({ query: city })
			  .then((result) => (
			  this.setState({ liste_voyage : this.state.liste_voyage.concat([result, city])})
		  ))
	  ))};
	  
	}
	
  

  getLogoStyle = () => {
    return {
      position: "absolute",
      zIndex: 1,
      left: "40px",
    };
  };

  render() {
    return (
      <div className="App">
        <h1 style={this.getLogoStyle()}>WaysToGo</h1>
        <Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {this.state.liste_voyage.map((coord, city) => (
			  coord[0].x != undefined ?
		  <Marker position={[coord[0].y, coord[0].x]}>
		  console.log(coord);
              <Popup>
                <h1>{city}</h1>
              </Popup>
			  </Marker> : ""
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
