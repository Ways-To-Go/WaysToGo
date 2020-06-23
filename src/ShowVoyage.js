import React, { Component } from "react";
import "./App.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import EditStep, { ButtonDeleteTrip } from "./editStep.js";
import AddStep from "./addStep.js";

// show the head of the trip
/* Need a parameter param like :
 * param = {
 * title = string
 * ?startdate = string in a good date format (aaaa-mm-dd)
 * vegan = bool
 * ecological = bool
 * author {
 *		firstName = string
 *		lastName = string
 *	}
 *	stages = list of stage
 * }
 */
export class EnteteVoyage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			param: props.param,
		};

		this.saveTripButton = React.createRef();
		this.verifIfTripAlreadySaved = this.verifIfTripAlreadySaved.bind(this);

		this.monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

	}

	/* TODO :
	 * qui retourne le nombre de photos
	 * qui retourne le nombre de pays ou passe le voyage
	 */

	getStageNumber(etapes) {
		return etapes.length;
	}

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
	getDureeVoyage1(etapes) {
		if (etapes.length > 0) {
			var d =
				new Date(etapes[etapes.length - 1].arrival) -
				new Date(etapes[0].departure);
			const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
			return diffDays;
		} else return 0;
	}

	getDureeVoyage2(date1, date2) {
		var d = new Date(date2) - new Date(date1);
		const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
		return diffDays;
	}

	// renvoi la date a afficher (mois - mois)
	getMonthsDate1(etapes) {
		if (etapes.length > 0) {
			var d = this.getDateDebut(etapes);
			var a = this.getDateFin(etapes);
			if (d !== a)
				return this.getDateDebut(etapes) + " - " + this.getDateFin(etapes);
			else return d;
		} else return "";
	}

	getMonthsDate2(date1, date2) {
		var d = new Date(date1);
		var a = new Date(date2);
		if (d.getMonth() !== a.getMonth())
			return (
				this.monthNames[d.getMonth()] + " - " + this.monthNames[a.getMonth()]
			);
		else return this.monthNames[d.getMonth()];
	}

	// from StackOverflow
	getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	verifIfTripAlreadySaved() {
		// if I'm connected : show the button save/de-save.
		if (this.props.connected) {
			var xhttp = new XMLHttpRequest();
			var superThis = this;
			xhttp.onreadystatechange = function () {
				//console.log(this.responseText);
				if (this.readyState === 4 && this.status === 200) {
					superThis.saveTripButton.current.style.visibility = "visible";

					var listformat = [];
					//console.log(JSON.parse(this.responseText));
					JSON.parse(this.responseText).recordedTrips.forEach(function (item) {
						listformat.push(item["@id"]);
					});

					if (listformat.indexOf("/api/trips/" + superThis.props.param.id) === -1) {
						superThis.saveTripButton.current.innerHTML = "Save this trip";
					}
					else {
						superThis.saveTripButton.current.innerHTML = "Trip already saved :) Click to cancel";
					}

				}
			};
			xhttp.open("GET", "https://wtg.aymerik-diebold.fr/api/users/" + superThis.getCookie("id"), true);
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.setRequestHeader('Authorization', 'Bearer ' + superThis.props.token);
			xhttp.send();
		}
	}

	componentDidMount() {
		this.verifIfTripAlreadySaved();
	};

	saveTrip() {
		//console.log(document.cookie);

		// we first retrieve user already saved Trips
		var xhttp = new XMLHttpRequest();
		var superThis = this;
		xhttp.onreadystatechange = function () {
			//console.log(this.responseText);
			if (this.readyState === 4 && this.status === 200) {
				//console.log("SUCCESS");

				var res = JSON.parse(this.responseText);
				var listformat = [];
				res.recordedTrips.forEach(function (item) {
					listformat.push(item["@id"]);
				});

				// if trip is already saved, we delete it, else we saved it
				var index = listformat.indexOf("/api/trips/" + superThis.props.param.id);
				if (index !== -1) {
					if (index > -1) {
						listformat.splice(index, 1);
					}


					var xhttp2 = new XMLHttpRequest();
					xhttp2.onreadystatechange = function () {
						//console.log(this.responseText);
						if (this.readyState === 4 && this.status === 200) {
							superThis.saveTripButton.current.innerHTML = "Save this trip";
						}
					};
					xhttp2.open("PATCH", "https://wtg.aymerik-diebold.fr/api/users/" + superThis.getCookie("id"), true);
					xhttp2.setRequestHeader('Content-Type', 'application/merge-patch+json');
					xhttp2.setRequestHeader('Authorization', 'Bearer ' + superThis.props.token);

					//console.log([...new Set(listformat)]);
					xhttp2.send(JSON.stringify({
						"recordedTrips": listformat // to onsure each trip is saved only one time
					}));




				}
				else {
					// then we add the new trip to the olders
					var xhttp2 = new XMLHttpRequest();
					xhttp2.onreadystatechange = function () {
						//console.log(this.responseText);
						if (this.readyState === 4 && this.status === 200) {
							superThis.saveTripButton.current.innerHTML = "Trip saved :) Click to cancel";
						}
					};
					//console.log("https://wtg.aymerik-diebold.fr/api/users/" + superThis.getCookie("id"));
					xhttp2.open("PATCH", "https://wtg.aymerik-diebold.fr/api/users/" + superThis.getCookie("id"), true);
					xhttp2.setRequestHeader('Content-Type', 'application/merge-patch+json');
					xhttp2.setRequestHeader('Authorization', 'Bearer ' + superThis.props.token);

					listformat.push("/api/trips/" + superThis.props.param.id);
					//console.log([...new Set(listformat)]);
					xhttp2.send(JSON.stringify({
						"recordedTrips": listformat // to onsure each trip is saved only one time
					}));
				}
			}
		};
		xhttp.open("GET", "https://wtg.aymerik-diebold.fr/api/users/" + this.getCookie("id"), true);
		xhttp.setRequestHeader('Content-Type', 'application/merge-patch+json');
		xhttp.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
		xhttp.send();
	}

	render() {
		return (
			<div ref={this.state.param.refHead} id="head">
				<h2>{this.state.param.title}</h2>
				<h5>
					{this.state.param.startdate
						? ""
						: this.getMonthsDate1(this.state.param.stages)}
				</h5>
				<p class="ladescription">{'"' + this.state.param.description + '"'}</p>
				<p>
					{this.state.param.vegan
						? "This trip is vegan"
						: "This trip is non-vegan"}
				</p>
				<p>
					{this.state.param.ecological
						? "This trip is ecological"
						: "This trip is marked as non-ecological"}
				</p>
				<p>
					auteur :{" "}
					{this.state.param.author.firstName +
						" " +
						this.state.param.author.lastName}
				</p>
				<p>
					Durée du voyage :{" "}
					{this.state.param.startdate
						? this.getDureeVoyage2(
							this.state.param.startdate,
							this.state.param.enddate
						)
						: this.getDureeVoyage1(this.state.param.stages)}{" "}
					jours
        </p>
				{this.state.param.edit ? (
					<div>
						<label for="files2" style={{ border: "2px solid black" }}>
							Change cover image
            </label>
						<input
							id="files2"
							style={{ visibility: "hidden" }}
							ref={this.state.param.refHead}
							type="file"
							accept="image/*"
							onChange={this.state.param.changeCover}
						/>
					</div>
				) : (
						<div>
							{this.props.myTrip ?
								<ButtonDeleteTrip id={this.state.param.id} token={this.props.token} />
								:
								""
							}
							<button ref={this.saveTripButton} style={{ visibility: "hidden" }} type="button" onClick={() => this.saveTrip()}>Save this trip</button>
						</div>
					)}
			</div>
		);
	}
}

// render a step
export class EtapeVoyage extends React.Component {
	render() {
		return (
			<div>
				<div class="etape">
					<p class="nomEtape">{this.props.etape.title}</p>
					{console.log(this.props.etape)}
					<p class="villedate_etape">
						{this.props.etape.city + " • " + new Date(this.props.etape.arrival)}
					</p>
					<p>{this.props.etape.description}</p>
					{this.props.etape.photos.map((photo, i) => (
						<div>
							<img
								key={this.props.editStepKey.toString() + i.toString()}
								src={photo.path}
								alt={photo.title}
								height="150"
								width="200"
							></img>

							<p key={i}>{photo.description}</p>
						</div>
					))}

					{this.props.myTrip ?
						<EditStep reload={ true } key={this.props.editStepKey.toString + "add"} stepKey={this.props.editStepKey} step={this.props.etape} token={this.props.token} />
						//console.log("here")
						:
						""
					}
				</div>

				{this.props.etape.departureTransport ? (
					<div class="transition_etape">
						<p class="transitionTexte">
							• Moyen de transport : {this.props.etape.departureTransport.type}
						</p>
					</div>
				) : (
						""
					)}
				{/*this.props.myTrip ?
					<AddStep tripId={this.props.tripId} key={this.props.editStepKey} stepKey={this.props.editStepKey} token={this.props.token} />
					//console.log("here")
					:
					console.log("not here")
				*/}
			</div>
		);
	}
}

class ShowVoyage extends Component {
	constructor(props) {
		super(props);

		this.loadDoc(this); // on recupere le voyage souhaite avec une requete ajax
		this.verifTripIsMine(this);

		this.state = {
			param: false,
			myTrip: false
		};
	}

	verifTripIsMine() {
		Axios.get("https://wtg.aymerik-diebold.fr/api/me", {
			headers: { Authorization: "Bearer " + this.props.token },
		}).then((res) => {


			//var res2 = res.data.trips;
			//console.log(res2);
			var listformat = [];
			res.data.trips.forEach(function (item) {
				listformat.push(parseInt(item.id));
			});


			var index = listformat.indexOf(parseInt(this.props.id));
			if (index != -1) {
				this.setState({ myTrip: true });
			}

		})
			.catch((err) => {
				console.log("Error when retrieve user id");
				throw err;
			});
	}

	loadDoc(parentVoyage) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				const param = JSON.parse(this.responseText);
				parentVoyage.setState({ param: param });
			}
		};
		xhttp.open(
			"GET",
			"https://wtg.aymerik-diebold.fr/api/trips/" + parentVoyage.props.id,
			true
		);
		xhttp.send();
	}

	render() {
		var content = "";
		if (!this.state.param) {
			content = (
				<h1>Chargement en cours...</h1>
			);
		} else {
			content = (
				<div>
					<NavigationBar
						connected={this.props.connected}
						connect={this.props.connect}
					/>
					<div id="carteSide">
						<Map id="ShowVoyageMap" center={[40.0, 3.0]} zoom={1}>
							<TileLayer
								attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>

							{this.state.param.stages.map((etape) => (
								<Marker position={[etape.lng, etape.lat]}>
									<Popup>
										<h1>{etape.description}</h1>
									</Popup>
								</Marker>
							))}
						</Map>
					</div>

					<div id="information">
						<EnteteVoyage param={this.state.param} myTrip={this.state.myTrip} token={this.props.token} connect={this.props.connect} connected={this.props.connected} />
						{this.state.myTrip ?
							<AddStep reload={ true } tripId={this.state.param.id} key={"firstAddStep"} stepKey={"firstAddStep"} token={this.props.token} />
							//console.log("here")
							:
							//console.log("not here")
							""
						}
						<div id="etapes">
							{this.state.param.stages.map((etape, i) => (
								<EtapeVoyage key={i} tripId={this.state.param.id} etape={etape} editStepKey={i} photos={etape.photos} myTrip={this.state.myTrip} token={this.props.token} />
							))}
						</div>
					</div>
				</div>
			);
		}
		return content;
	}
}

export default ShowVoyage;
