import React, { Component } from "react";
import "./App.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import NavigationBar from "./NavigationBar";
import Axios from "axios";

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
				console.log(this.responseText);
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
				//else if (this.readyState === 4 && this.status === 401) {
				// renouvellement token automatiquement
				/*const headers = {
					"Content-Type": "application/json",
				};
				Axios.post(
					"https://wtg.aymerik-diebold.fr/login_check",
					{
						username: "mailleon@gmail.com",
						password: "monmdp111A!",
					},
					{ headers }
				)
					.then((res) => {
						//console.log(res);
						superThis.props.connect(res.data.token);
						superThis.verifIfTripAlreadySaved();
					})
					.catch((err) => {
						throw err;
					});*/
				//alert("Connection time out. Please reconnect");
				//}
			};
			xhttp.open("GET", "https://wtg.aymerik-diebold.fr/api/users/" + superThis.getCookie("id"), true);
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.setRequestHeader('Authorization', 'Bearer ' + superThis.getCookie("token"));
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
					xhttp2.setRequestHeader('Authorization', 'Bearer ' + superThis.getCookie("token"));

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
					xhttp2.setRequestHeader('Authorization', 'Bearer ' + superThis.getCookie("token"));

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
		xhttp.setRequestHeader('Authorization', 'Bearer ' + this.getCookie("token"));
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
						<button ref={this.saveTripButton} style={{ visibility: "hidden" }} type="button" onClick={() => this.saveTrip()}>Save this trip</button>
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
					<p class="nomEtape">{this.props.etape.description}</p>

					<p class="villedate_etape">
						{this.props.etape.city + " • " + new Date(this.props.etape.arrival)}
					</p>

					{this.props.etape.photos.map((photo, i) => (
						<div>
							<img
								key={i}
								src={photo.path}
								alt={photo.title}
								height="150"
								width="200"
							></img>

							<p key={i}>{photo.description}</p>
						</div>
					))}
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
			id: props.id,
			titre: null,
			toRender: <h1>Chargement en cours...</h1>,
		};
	}

	insertParam(key, value) {
		key = encodeURI(key); value = encodeURI(value);

		var kvp = document.location.search.substr(1).split('&');

		var i = kvp.length; var x; while (i--) {
			x = kvp[i].split('=');

			if (x[0] == key) {
				x[1] = value;
				kvp[i] = x.join('=');
				break;
			}
		}

		if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

		//this will reload the page, it's likely better to store this until finished
		document.location.search = kvp.join('&');
	}

	verifTripIsMine() {
		Axios.get("https://wtg.aymerik-diebold.fr/api/me", {
			headers: { Authorization: "Bearer " + this.props.token },
		}).then((res) => {
				console.log(res);


			//var res2 = res.data.trips;
			//console.log(res2);
				var listformat = [];
			res.data.trips.forEach(function (item) {
				listformat.push(parseInt(item.id));
				});
			
			
			var index = listformat.indexOf(parseInt(this.props.id));
				console.log(index);
				if (index == -1) {
					console.log("not found");
				} else {
					console.log("found");
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
				//console.log("Voyage : "); console.log(param);
				parentVoyage.setState({
					toRender: (
						<div>
							<NavigationBar
								connected={parentVoyage.props.connected}
								connect={parentVoyage.props.connect}
							/>
							<div id="carteSide">
								<Map id="ShowVoyageMap" center={[40.0, 3.0]} zoom={1}>
									<TileLayer
										attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									/>

									{param.stages.map((etape) => (
										<Marker position={[etape.lng, etape.lat]}>
											<Popup>
												<h1>{etape.description}</h1>
											</Popup>
										</Marker>
									))}
								</Map>
							</div>

							<div id="information">
								<EnteteVoyage param={param} connect={parentVoyage.props.connect} connected={parentVoyage.props.connected} />

								<div id="etapes">
									{//console.log(param)
									}
									{param.stages.map((etape) => (
										<EtapeVoyage etape={etape} photos={etape.photos} />
									))}
								</div>
							</div>
						</div>
					),
				});
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
		let content = (
			<div>
				<div>{this.state.toRender}</div>
			</div>
		);
		return content;
	}
}

export default ShowVoyage;
