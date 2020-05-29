import React, { Component } from "react";
import "./App.css";
import Upload from "./Upload";
import ResearchBarCity from "./ResearchBarCity";


class AddStep extends Component {
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

		this.refHead = React.createRef();

		this.imgcontainer2 = React.createRef();
		this.inputphotoToReset = React.createRef();
	}

	addFunction() {
		var listformat = [];
		console.log(this.state.files);
		if (this.state.files.length > 0) {
			this.state.files.forEach(function (item) {
				listformat.push("/api/photos/" + item.idAPI);
			});
		} else {
			listformat = this.props.photos;
		}

		var xhttp = new XMLHttpRequest();
		var parentVoyage = this;
		xhttp.onreadystatechange = function () {
			console.log(this.responseText);
			var res = this.responseText;
			if (this.readyState === 4 && this.status === 201) {
				// maintenant on envoi le transport
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					//console.log(this.responseText);
					if (this.readyState === 4 && this.status === 201) {
						//console.log("Upload transport etape success");
						parentVoyage.toggleModal();
						document.location.reload(true);
					}
				};
				//console.log("https://wtg.aymerik-diebold.fr" + JSON.parse(res).departureTransport);
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
			//departureTransport: this.newDepartureTransport.current.value,
			trip: "/api/trips/" + this.props.tripId,
			lng: this.state.newLat,
			lat: this.state.newLnt,
			title: this.newName.current.value,
			photos: listformat
		}));

		/*this.props.returnEditStep({
			stepName: this.newName.current.value, stepLocation: this.newCity.current.value,
			stepArrivalDate: this.newDate.current.value, stepDepartureDate: this.newDateDepart.current.value,
			stepDepartureTransport: this.newDepartureTransport.current.value, stepDescription: this.newDescription.current.value,
			stepPhotos:this.state.files});*/
	}

	getLatLnt(lat, lnt) {
		this.setState({
			newLnt: lnt,
			newLat: lat
		})
	}



	// to edit pictures

	addImgFile(img) {
		//console.log(this);
		//console.log(this.state);
		//console.log(img);
		this.state.files.push(img);
		/*this.setState = {
			files: this.state.files.concat(img) // ajout des nouvelles images a ceux deja existantes
		};*/
		console.log(this.state);
	}
	changeButtonState(etat) {
		this.boutonOK2.current.disabled = etat;
		if (etat === true)
			this.boutonOK2.current.textContent = "Image upload in progress..."
		else
			this.boutonOK2.current.textContent = "Add step"
		//console.log("change etat avec : ", etat);
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
		//console.log("je suis dans editStep");
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

						<label for="ltransport">Moyen de transport entre étapes</label>
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

export default AddStep;
