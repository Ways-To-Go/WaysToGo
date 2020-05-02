import React, { Component } from "react";
import "./App.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";


export class EnteteVoyage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			param: props.param
		};

		this.monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
	}

	/* TODO :
	 * fonction qui retourne le nombre d'étapes
	 * qui retourne le nombre de photos
	 * qui retourne le nombre de pays
	 */

	// retourne le mois de debut
	getDateDebut(etapes) {
		if (etapes.length > 0) {
			var d = new Date(etapes[0].departure);
			return this.monthNames[d.getMonth()];
		} else return null;
	}

	// retourne le mois de fin
	getDateFin(etapes) {
		if (etapes.length > 0) {
			var d = new Date(etapes[etapes.length - 1].arrival);
			return this.monthNames[d.getMonth()];
		} else return 0;
	}

	// retourne le nombre de jours
	getDureeVoyage(etapes) {
		if (etapes.length > 0) {
			var d = new Date(etapes[etapes.length - 1].arrival) - new Date(etapes[0].departure);
			const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
			return diffDays;
		} else return 0;
	}

	getDureeVoyage(date1, date2) {
			var d = new Date(date2) - new Date(date1);
			const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
			return diffDays;
	}

	// renvoi la date a afficher (mois - mois)
	getMonthsDate(etapes) {
		var d = this.getDateDebut(etapes);
		var a = this.getDateFin(etapes);
		if (d != a) return this.getDateDebut(etapes) + " - " + this.getDateFin(etapes);
		else return d;
	}

	getMonthsDate(date1, date2) {
		var d = new Date(date1);
		var a = new Date(date2);
		if (d.getMonth() != a.getMonth()) return this.monthNames[d.getMonth()] + " - " + this.monthNames[a.getMonth()];
		else return this.monthNames[d.getMonth()];
	}

	render() {
		return (
			<div id="head">
				<h2>{this.state.param.title}</h2>
				<h5>{this.state.param.startdate ? this.getMonthsDate(this.state.param.startdate, this.state.param.enddate) : this.getMonthsDate(this.state.param.stages)}</h5>
				<p class="ladescription">{'"' + this.state.param.description + '"'}</p>
				<p>{this.state.param.vegan ? "Ce voyage est vegan" : "Ce voyage est signalé comme non-vegan"}</p>
				<p>{this.state.param.ecological ? "Ce voyage est ecologique" : "Ce voyage est signalé comme non-ecologique"}</p>
				<p>auteur : {this.state.param.author.firstName + " " + this.state.param.author.lastName}</p>
				<p>Durée du voyage : {this.state.param.startdate ? this.getDureeVoyage(this.state.param.startdate, this.state.param.enddate) : this.getDureeVoyage(this.state.param.stages)} jours</p>
			</div>
		);
	}
}


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
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				const param = JSON.parse(this.responseText);
				parentVoyage.setState({
					toRender:
						<div>
							<div id="carteSide">
								<Map id="ShowVoyageMap" center={[40.0, 3.0]} zoom={2}>
									<TileLayer
										attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>

									<Marker position={[40.0, 3.0]}>
										<Popup>
											<h1>{'Nom à venir'}</h1>
											<a href={"?show=trip&id=1"}>Cliquez</a>
										</Popup>
									</Marker>
								</Map>
							</div>

							<div id="information">
								<EnteteVoyage param={param} />

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
						</div>
				});
			}
		};
		xhttp.open("GET", "http://wtg.aymerik-diebold.fr/api/trips/" + parentVoyage.props.id, true);
		xhttp.send();
	}

	render() {
		let content = <div><div>{this.state.toRender}</div></div>;
		return (
			content
		);
	}
}


export default ShowVoyage;