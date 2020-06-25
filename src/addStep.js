import React, { Component } from "react";
import "./App.css";
import Upload from "./Upload";
import ResearchBarCity from "./ResearchBarCity";

// affiche une popup permettant de modifier un voyage donné/
// reload la page si modification
/*
 * si parametre reload=false, alors il faut fournir une methode callback qui renverra les parametres
 */
export default class AddStep extends Component {
	constructor(props) {
		super(props);
		this.state = {
			files: []
		};

		this.addFunction = this.addFunction.bind(this);
		this.getLatLnt = this.getLatLnt.bind(this);
		this.addImgFile = this.addImgFile.bind(this);
		this.toggleModal = this.toggleModal.bind(this);

		this.newCity = React.createRef();
		this.newName = React.createRef();
		this.newDate = React.createRef();
		this.newDateDepart = React.createRef();
		this.newDepartureTransport = React.createRef();
		this.newDescription = React.createRef();

		this.newLat = React.createRef();
		this.newLnt = React.createRef();
		this.boutonOK2 = React.createRef();
		this.modal = React.createRef();
		this.imgcontainer2 = React.createRef();
		this.inputphotoToReset = React.createRef();
	}

	// add a new step to a trip.
	// create the step, then add the transportation
	addFunction() {
		if (this.newName.current.value != "" && this.newDate.current.value != ""
			&& this.newDateDepart.current.value != "" && this.newCity.current.value != "") {

			// si l'utilisateur met de nouvelles photos, on change tout. Si il n'en met pas de nouvelles, on laisse les anciennes
			var listformat = [];
			if (this.props.reload) {
				if (this.state.files.length > 0) listformat = this.state.files;
				else listformat = this.props.photos;
			} else {
				if (this.state.files.length > 0)
					this.state.files.forEach(function (item) {
						listformat.push(item.image_URL_BDD);
					});
				else listformat = this.props.photos;
			}

			var xhttp = new XMLHttpRequest();
			var parentVoyage = this;
			xhttp.onreadystatechange = function () {
				//console.log(this.responseText);
				var res = this.responseText;
				if (this.readyState === 4 && this.status === 201) {
					var xhttp = new XMLHttpRequest();
					//console.log(res);
					xhttp.onreadystatechange = function () {
						//console.log(this.responseText);
						if (this.readyState === 4 && this.status === 201) {
							if (parentVoyage.props.reload) document.location.reload(true); //reload page to see modifications
							else parentVoyage.props.callback({
								city: parentVoyage.newCity.current.value,
								description: parentVoyage.newDescription.current.value,
								arrival: parentVoyage.newDate.current.value,
								departure: parentVoyage.newDateDepart.current.value,
								title: parentVoyage.newName.current.value,
								transport: parentVoyage.newDepartureTransport.current.value,
								photos: parentVoyage.state.files,
								etape: res
							})
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
				trip: "/api/trips/" + this.props.tripId,
				lng: this.state.newLat,
				lat: this.state.newLnt,
				title: this.newName.current.value,
				photos: listformat
			}));
		} else alert("Location, name, arrival and departure date required");
	}

	getLatLnt(lat, lnt) {
		this.setState({
			newLnt: lnt,
			newLat: lat
		})
	}

	// to edit pictures
	addImgFile(img) {
		console.log(img);
		if (this.props.reload) this.state.files.push(img.image_URL_BDD);
		else this.state.files.push(img);
	}
	changeButtonState(etat) {
		this.boutonOK2.current.disabled = etat; // disable button when upload, prevent button to be push until we have the ling of the image
		if (etat === true) this.boutonOK2.current.textContent = "Image upload in progress..."
		else this.boutonOK2.current.textContent = "Add step"
	}

	// show or hide modal
	toggleModal() {
		console.log("toggle modal edit");

		// change values inside the modal
		this.newName.current.value = "";
		this.newCity.current.value = "";
		this.newDate.current.value = "";
		this.newDateDepart.current.value = "";
		this.newDepartureTransport.current.value = "";
		this.newDescription.current.value = "";

		// toggle modal
		this.modal.current.classList.toggle("show-modal3");
	}

	render() {
		return (
			<div>
				<div ref={this.modal} class="modal3">
					<div class="modal-content">
						<h5>Add Step</h5>
						<span class="close-button" onClick={this.toggleModal}>×</span>

						<label for="lville">Location</label>
						<ResearchBarCity refCity={this.newCity} getdataback={this.getLatLnt} newLat={this.newLat} newLnt={this.newLnt} />

						<label for="nometape">Step name</label>
						<input ref={this.newName} type="text" id="nometape" name="nometape" placeholder="ex. visit of the Eiffel tower"></input>

						<label for="larrivee">Arrival date</label>
						<input ref={this.newDate} type="text" id="larrivee" name="larrivee" placeholder="Arrival.. (YYYY-MM-DD)"></input>

						<label for="ldepart">Departure date</label>
						<input ref={this.newDateDepart} type="text" id="ldepart" name="ldepart" placeholder="Departure.. (YYYY-MM-DD)"></input>

						<label for="ltransport">Means of transport between steps</label>
						<input ref={this.newDepartureTransport} type="text" id="ltransport" name="ltransport" placeholder="Train, car, tuk-tuk, on foot .."></input>

						<label for="ldescription">Your story</label>
						<textarea ref={this.newDescription} id="ldescription" name="ldescription" placeholder="What you want.."></textarea>

						<Upload key={"addStep" + this.props.stepKey} uploadID={"addStep"} token={this.props.token} addImgFile={this.addImgFile} files={this.state.files} changeButtonState={this.changeButtonState.bind(this)} imgcontainer={this.imgcontainer2} refInput={this.inputphotoToReset} />

						<button type="button" ref={this.boutonOK2} onClick={this.addFunction.bind(this)}>Add step</button>
					</div>
				</div>
				<button type="button" onClick={this.toggleModal}>Add step</button>
			</div>
		);
	}
}