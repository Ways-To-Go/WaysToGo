import React, { Component } from "react";
import "./App.css";
import { EnteteVoyage } from "./ShowVoyage";
import ReactDOM from "react-dom";
import NavigationBar from "./NavigationBar";


// Gere l'ajout d'image et l'affichage. https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
class Upload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: props.files, // contient l'ensemble des images. Vide initialement. On passe la référence
			filesToShow: []
		}

		this.handleChange = this.handleChange.bind(this);
	}

	// when we get images
	handleChange(event) {
		this.props.changeButtonState(true);
		this.setState({
			filesToShow: [...this.state.filesToShow, ...event.target.files] // ajout des nouvelles images a ceux deja existantes
		});

		//console.log([...event.target.files]);
		var parentUpload = this;
		var totalEndUpload = 0;
		var images = event.target.files;
		[...event.target.files].map(function (file) {
			// senf img to imgbb for saving
			//console.log('send...');
			var xhttp = new XMLHttpRequest();
			var img = file;
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {
					//console.log("upload finit");




					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function () {
						//console.log(this.responseText);
						if (this.readyState === 4 && this.status === 201) {
							console.log("Upload photo in API success");

							//parentUpload.state.urllist.push(JSON.parse(this.responseText).id); // ajout des nouvelles url d'images a ceux deja existantes
							parentUpload.props.addImgFile({ image: img, idAPI: JSON.parse(this.responseText).id });
							//parentUpload.setState({
							//	files: parentUpload.props.files.concat({ image: img, idAPI: JSON.parse(this.responseText).id }) // ajout des nouvelles images a ceux deja existantes
							//});
							totalEndUpload += 1;
							//console.log(parentUpload.state.files);
							if (totalEndUpload == images.length) {
								parentUpload.props.changeButtonState(false);
							}
							//parentUpload.state.files = [];
							//parentUpload.state.urllist = [];
						}
					};
					xhttp.open("POST", "https://wtg.aymerik-diebold.fr/api/photos", true);
					xhttp.setRequestHeader('Authorization', 'Bearer ' + parentUpload.props.token);
					xhttp.setRequestHeader('Content-Type', 'application/json');
					xhttp.send(JSON.stringify({
						path: JSON.parse(this.responseText).data.link,
						//stage: parentVoyage.newDepartureTransport.current.value,
						isCover: false
					}));





				}
			};


			xhttp.open("POST", "https://api.imgur.com/3/image", true);
			xhttp.setRequestHeader('Authorization', 'Client-ID 140f137c33f88ac');

			var data = new FormData();
			data.append('image', file);

			xhttp.send(data);
		})
	}

	render() {
		return (
			<div>
				<div ref={this.props.imgcontainer}>
					{/* Display all selected images. */}
					{this.state.filesToShow && [...this.state.filesToShow].map((file) => (
						<img width="200px" height="200px" src={URL.createObjectURL(file)} alt="Image" />
					))}
				</div>
				<input ref={this.props.refInput} type="file" accept="image/*" multiple onChange={this.handleChange} />
			</div>
		);
	}
}


// Gere la recherche des villes/adresses dans la popup add new Voyage
class ResearchBarCity extends React.Component {
	constructor(props) {
		super(props)

		this.researchRef = React.createRef();
	}

	// Autocomplete for form
	hinter(event) {
		// save change
		this.props.getdataback(0, 0);

		// minimum number of characters before we start to generate suggestions
		if (event.target.value.length < 2) return;
		else {

			var xhttp = new XMLHttpRequest();
			var parentV = this;

			xhttp.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {

					// We're expecting a json response so we convert it to an object
					var response = JSON.parse(this.responseText);

					// clear any previously loaded options in the datalist
					parentV.researchRef.current.innerHTML = "";

					response.forEach(function (item) {
						var option = document.createElement('div');

						option.innerText = item.display_name;
						// add onclick event : we fill the input
						option.onclick = function () {
							parentV.props.refCity.current.value = this.innerText;
							parentV.props.getdataback(parseFloat(item.lat), parseFloat(item.lon));
							parentV.researchRef.current.innerHTML = "";
						};

						// attach the div to the list div
						parentV.researchRef.current.appendChild(option);
					});
				}
			};

			// we use nominatim from openstreetmap to resolve adress
			xhttp.open("GET", "https://nominatim.openstreetmap.org/?addressdetails=1&format=json&limit=3&q=" + this.props.refCity.current.value, true);
			xhttp.send()
		}
	}

	render() {
		return (
			<div>
				<input ref={this.props.refCity} type="text" name="lville" placeholder="Place.." id="name_input" onKeyPress={this.hinter.bind(this)} />
				<div ref={this.researchRef} id="huge_list"></div>
			</div>
		);
	}
}


/* Parametre : 
 * arguments {
 *	name {
 *		value
 *	},
 *	location {
 *		value
 *	},
 *	date {
 *		value
 *	},
 *	story {
 *		value
 *	},
 *	files {
 *		value
 *	},
 * }
 */
class UneEtape extends React.Component {
	constructor(props) {
		super(props);

		this.refLocation = React.createRef();
		this.refName = React.createRef();
		this.refDate = React.createRef();
		this.refDescription = React.createRef();
		this.refDateDepart = React.createRef();
		this.refDepartureTransport = React.createRef();
	}

	render() {
		return (
			<div class="etapevoyage">
				<button type="button" onClick={() => this.props.editStepLink(this.refName, this.refLocation, this.refDate, this.refDateDepart, this.refDepartureTransport, this.refDescription)}>Edit step</button>
				<br></br>

				<label>Location : </label>
				<label ref={this.refLocation}>{this.props.arguments.location}</label>
				<br></br>

				<label>Step name : </label>
				<label ref={this.refName}>{this.props.arguments.name}</label>
				<br></br>

				<label>Arrival date : </label>
				<label ref={this.refDate}>{this.props.arguments.date}</label>
				<br></br>

				<label>Departure date : </label>
				<label ref={this.refDateDepart}>{this.props.arguments.dateDepart}</label>
				<br></br>

				<label>Moyen de transport : </label>
				<label ref={this.refDepartureTransport}>{this.props.arguments.departureTransport}</label>
				<br></br>

				<label>Your story : </label>
				<label ref={this.refDescription}>{this.props.arguments.description}</label>
				<br></br>

				{this.props.arguments.files && [...this.props.arguments.files].map((file, i) => (
					<img key={i} width="200px" height="200px" src={URL.createObjectURL(file.image)} alt="Image" />
				))}
			</div>
		)
	}
}

// seconde vue de la création de voyage : permet d'ajouter des etapes
class CreationVoyageAjoutEtapes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			description: props.description,
			vegan: props.vegan,
			ecolo: props.ecolo,
			voyageId: props.voyageId,
			editStepBool: false,

			files: []
		};

		this.setTextInputRef = React.createRef();

		this.inputphotoToReset = React.createRef();
		this.imgcontainer = React.createRef();

		this.toggleModal = this.toggleModal.bind(this)
		this.getLatLnt = this.getLatLnt.bind(this);
		this.editStep = this.editStep.bind(this);
		this.changeEnteteBackground = this.changeEnteteBackground.bind(this);

		this.newCity = React.createRef();
		this.newName = React.createRef();
		this.newDate = React.createRef();
		this.newDateDepart = React.createRef();
		this.newDepartureTransport = React.createRef();
		this.newDescription = React.createRef();

		this.newLat = React.createRef();
		this.newLnt = React.createRef();
		this.boutonOK = React.createRef();

		this.refHead = React.createRef();
	}

	editStep(refName, refLocation, refDate, refDateDepart, refDepartureTransport, refDescription) {
		//console.log("EDIT !");
		// reset values of components in the modal
		this.newDescription.current.value = this.state.stepDescription;
		this.newName.current.value = this.state.stepName;
		this.newDate.current.value = this.state.stepDate;
		this.newDateDepart.current.value = this.state.stepDateDepart;
		this.newDepartureTransport.current.value = this.state.stepDepartureTransport;
		this.newCity.current.value = this.state.stepCity;


		this.setState({
			editStepBool: true,
			refLocation: refLocation,
			stepDate: refDate,
			stepDateDepart: refDateDepart,
			stepDepartureTransport: refDepartureTransport,
			refDescription: refDescription,
			refName: refName,
		})

		//console.log(this.state.refLocation);

		document.querySelector(".modal").classList.toggle("show-modal");
	}

	addEtapeVoyage() {
		var xhttp = new XMLHttpRequest();
		var parentVoyage = this;
		xhttp.onreadystatechange = function () {
			//console.log(this.responseText);
			var res = this.responseText;
			if (this.readyState === 4 && this.status === 201) {
				if (parentVoyage.state.editStepBool == false) {
					ReactDOM.render(<UneEtape arguments={
						{
							"location": parentVoyage.newCity.current.value,
							"files": parentVoyage.state.files,
							"description": parentVoyage.newDescription.current.value,
							"date": parentVoyage.newDate.current.value,
							"dateDepart": parentVoyage.newDateDepart.current.value,
							"departureTransport": parentVoyage.newDepartureTransport.current.value,
							"name": parentVoyage.newName.current.value
						}} editStepLink={parentVoyage.editStep} />, parentVoyage.setTextInputRef.current.appendChild(document.createElement('div')))
				} else {
					parentVoyage.state.refLocation.current.textContent = parentVoyage.newCity.current.value;
					parentVoyage.state.refDate.current.textContent = parentVoyage.newDate.current.value;
					parentVoyage.state.refDateDepart.current.textContent = parentVoyage.newDateDepart.current.value;
					parentVoyage.state.refDepartureTransport.current.textContent = parentVoyage.newDepartureTransport.current.value;
					parentVoyage.state.refDescription.current.textContent = parentVoyage.newDescription.current.value;
					parentVoyage.state.refName.current.textContent = parentVoyage.newName.current.value;
				}

				// maintenant on envoi le transport
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					//console.log(this.responseText);
					if (this.readyState === 4 && this.status === 201) {
						//console.log("Upload transport etape success");
						parentVoyage.state.editStepBool = false;
						parentVoyage.toggleModal();
					}
				};
				xhttp.open("POST", "https://wtg.aymerik-diebold.fr/api/transports", true);
				xhttp.setRequestHeader('Authorization', 'Bearer ' + parentVoyage.props.token);
				xhttp.setRequestHeader('Content-Type', 'application/json');
				xhttp.send(JSON.stringify({
					stageFrom: "/api/stages/" + JSON.parse(res).id,
					type: parentVoyage.newDepartureTransport.current.value,
					distance: 0
				}));

			}
		};

		this.setState({
			stepDescription: this.newDescription.current.value,
			stepName: this.newName.current.value,
			stepDate: this.newDate.current.value,
			stepDateDepart: this.newDateDepart.current.value,
			stepDepartureTransport: this.newDepartureTransport.current.value,
			stepId: this.state.voyageId,
			stepLat: this.state.newLat,
			stepLnt: this.state.newLnt,
			stepCity: this.newCity.current.value,
			stepFiles: this.state.files
		})

		var listformat = [];
		//console.log(this.state.files);
		this.state.files.forEach(function (item) {
			listformat.push("/api/photos/" + item.idAPI);
		});
		//console.log(listformat);

		xhttp.open("POST", "https://wtg.aymerik-diebold.fr/api/stages", true);
		xhttp.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify({
			city: this.newCity.current.value,
			country: "rien",
			mark: 0,
			description: this.newDescription.current.value,
			arrival: this.newDate.current.value,
			departure: this.newDateDepart.current.value,
			//departureTransport: this.newDepartureTransport.current.value,
			trip: "/api/trips/" + this.state.voyageId,
			lng: this.state.newLat,
			lat: this.state.newLnt,
			title: this.newName.current.value,
			photos: listformat
		}));
	}

	toggleModal() {
		document.querySelector(".modal").classList.toggle("show-modal");

		// reset values of components in the modal
		this.newDescription.current.value = "";
		this.newName.current.value = "";
		this.newDate.current.value = "";
		this.newDateDepart.current.value = "";
		this.newDepartureTransport.current.value = "";
		this.newCity.current.value = "";
		this.inputphotoToReset.current.value = "";
		this.imgcontainer.current.textContent = ""; // textContent is faster than innerHTML

		this.setState({
			files: []
		})
	}

	changeButtonState(etat) {
		this.boutonOK.current.disabled = etat;
		if (etat == true)
			this.boutonOK.current.textContent = "Image upload in progress..."
		else
			this.boutonOK.current.textContent = "Add step"
		//console.log("change etat avec : ", etat);
	}

	getLatLnt(lat, lnt) {
		this.setState({
			newLnt: lnt,
			newLat: lat
		})
	}

	changeEnteteBackground(event) {
		this.refHead.current.style.backgroundImage = "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('" + URL.createObjectURL(event.target.files[0]) + "')";
	}

	addImgFile(img) {
		this.setState({
			files: this.state.files.concat(img) // ajout des nouvelles images a ceux deja existantes
		});
	}

	render() {
		return (
			<div id="information">
				<EnteteVoyage param={{ changeCover: this.changeEnteteBackground, edit: true, refHead: this.refHead, title: this.state.name, description: this.state.description, vegan: this.state.vegan, ecolo: this.state.ecolo, stages: [], author: { firstName: "Nicolas", lastName: "Dupond" } }} />

				<div ref={this.setTextInputRef}></div>

				<div class="modal">
					<div class="modal-content">
						<span class="close-button" onClick={this.toggleModal}>×</span>
						{/*https://community.algolia.com/places/documentation.html#getting-started */}
						<label for="lville">Location</label>
						<ResearchBarCity refCity={this.newCity} getdataback={this.getLatLnt} newLat={this.newLat} newLnt={this.newLnt} />

						<label for="nometape">Step name</label>
						<input ref={this.newName} type="text" id="nometape" name="nometape" placeholder="ex. Promenade dans Paris"></input>

						<label for="larrivee">Arrival date</label>
						<input ref={this.newDate} type="text" id="larrivee" name="larrivee" placeholder="Arrivée.."></input>

						<label for="ldepart">Departure date</label>
						<input ref={this.newDateDepart} type="text" id="ldepart" name="ldepart" placeholder="Arrivée.."></input>

						<label for="ltransport">Moyen de transport entre étapes</label>
						<input ref={this.newDepartureTransport} type="text" id="ltransport" name="ltransport" placeholder="Moyen transport.."></input>

						<label for="ldescription">Your story</label>
						<textarea ref={this.newDescription} id="ldescription" name="ldescription" placeholder="Ce que vous voulez..."></textarea>

						<Upload token={this.props.token} addImgFile={this.addImgFile.bind(this)} files={this.state.files} changeButtonState={this.changeButtonState.bind(this)} imgcontainer={this.imgcontainer} refInput={this.inputphotoToReset} />

						<button type="button" ref={this.boutonOK} onClick={this.addEtapeVoyage.bind(this)}>Add step</button>

					</div>
				</div>
				<button class="trigger" onClick={this.toggleModal}>Add a step</button>
			</div>
		);
	}
}


class ModalChargement extends React.Component {
	render() {
		return (
			<div class="modal_chargement">
				<div class="modal-content">
					<p>Chargement</p>

				</div>
			</div>
		)
	}
}


class CreationVoyage extends React.Component {
	constructor(props) {
		super(props);

		this.description = React.createRef();
		this.name = React.createRef();
		this.vegan = React.createRef();
		this.ecolo = React.createRef();
	}

	addVoyageCheck() {
		if (this.description.current.validity.valid && this.name.current.validity.valid) {
			this.props.addMyVoyage(this.name.current.value, this.description.current.value, this.vegan.current.checked, this.ecolo.current.checked)
		} else alert("Please complete the Details section")
	}

	render() {
		return (
			<div className="formulaire">
				<h3>New trip</h3>

				<div className="partie">
					<h4>Détails</h4>
					<div className="partiedetails">
						<p className="partieLabel">Trip name:</p>
						<input required type="text" ref={this.name} id="fname" name="firstname" placeholder="ex. A grand tour of France"></input>

						<p className="partieLabel">Trip summary:</p>
						<textarea required ref={this.description} id="lname" name="lastname" placeholder="ex. A bucolic journey through the French countryside: old relics and local specialities"></textarea>
					</div>
				</div>


				<div className="partie">
					<h4>Parameters</h4>
					<div className="partiedetails">
						<div>
							<input ref={this.vegan} type="checkbox" id="voyagevegan" name="voyagevegan" value="newsletter"></input>
							<label htmlFor="voyagevegan">Is this trip vegan?</label>
						</div>

						<div>
							<input ref={this.ecolo} type="checkbox" id="voyageecolo" name="voyageecolo" value="newsletter"></input>
							<label htmlFor="voyageecolo">Is this trip environmentally friendly?</label>
						</div>
					</div>
				</div>


				<button type="button" className="boutonsend" onClick={this.addVoyageCheck.bind(this)}>Add my trip</button>
			</div>
		);
	}
}

export default class AddVoyage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			token: props.token,
			startNewVoyage: true,
			chargement: false,

			name: "",
			description: "",
			vegan: false,
			ecolo: false
		};

		this.renouvelerToken = this.renouvelerToken.bind(this);
		this.addMyVoyage = this.addMyVoyage.bind(this)
	}

	renouvelerToken() {
		var xhttp = new XMLHttpRequest();
		var parentToken = this;
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				parentToken.state.token = JSON.parse(this.responseText).token;
				parentToken.props.updateToken(parentToken.state.token);
				parentToken.addMyVoyage(parentToken.state.name, parentToken.state.description, parentToken.state.vegan, parentToken.state.ecolo);
			}
		};
		xhttp.open("POST", "https://wtg.aymerik-diebold.fr/login_check", true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify({
			"username": "mailleon@gmail.com",
			"password": "monmdp111A!"
		}));
	}

	addMyVoyage(newname, newdescription, newvegan, newecolo) {
		//console.log(newname, newdescription, newvegan, newecolo);
		this.setState({
			name: newname,
			description: newdescription,
			vegan: newvegan,
			ecolo: newecolo,
			chargement: true
		})
		var xhttp = new XMLHttpRequest();
		var parentVoyage = this;
		xhttp.onreadystatechange = function () {
			//console.log(this.responseText);
			if (this.readyState === 4 && this.status === 201) {
				var res = JSON.parse(this.responseText);
				parentVoyage.setState({
					chargement: false,
					startNewVoyage: false,
					voyageId: res.id
				})
			} else if (this.readyState === 4 && this.status === 401) {
				console.log("Token non valide, renouvellement...");
				console.log(parentVoyage.state.token)
				parentVoyage.renouvelerToken();
			}
		};

		xhttp.open("POST", "https://wtg.aymerik-diebold.fr/api/trips", true);
		xhttp.setRequestHeader('Authorization', 'Bearer ' + parentVoyage.state.token);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify({
			"title": newname,
			"description": newdescription,
			"vegan": newvegan,
			"ecological": newecolo,
			"author": "api/users/" + parentVoyage.props.connected,
			"keywords": "paris plage",
		}));

	}

	render() {
		return (
			<div>
				<NavigationBar active={1} token={this.props.token} connected={this.props.connected} connect={this.props.connect} />

				{this.state.startNewVoyage ?
					!this.state.chargement ?
						<CreationVoyage token={this.state.token} addMyVoyage={this.addMyVoyage.bind(this)} />
						:
						<ModalChargement />
					:
					<CreationVoyageAjoutEtapes token={this.state.token} voyageId={this.state.voyageId} name={this.state.name} vegan={this.state.vegan} ecolo={this.state.ecolo} description={this.state.description} />
				}
			</div>
		);

	}
}
