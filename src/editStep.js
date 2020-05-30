import React, { Component } from "react";
import "./App.css";
import Upload from "./Upload";
import ResearchBarCity from "./ResearchBarCity";


// show a button : delete trip when clicked
// parameters : id (the id of trip to be delete)
// return to the main page after deletion
export class ButtonDeleteTrip extends Component {
	deleteTrip() {
		var response = window.confirm("Delete ?");
		if (response == true) {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function () {
				//console.log(this.responseText);
				if (this.readyState === 4 && this.status === 204) {
					window.location = window.location.hostname; // return to hostpage
				}
			};

			xhttp.open("DELETE", "https://wtg.aymerik-diebold.fr/api/trips/" + this.props.id, true);
			xhttp.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.send();
		}
	}

	render() {
		return (
			<button type="button" onClick={this.deleteTrip.bind(this)}>Delete step</button>
		);
	}
}

class EditStep extends Component {
	constructor(props) {
        super(props);
        console.log(props.step);
		this.state = {
			files: [],
			title: props.step.title,
			city: props.step.city,
			arrival: props.step.arrival,
			departure: props.step.departure,
			//departureTransport: props.step.departureTransport.type,
			description: props.step.description,
			id: props.step.id,
			photos: props.step.photos
		};
		if (props.step.departureTransport !== 'undefined')
			this.state.departureTransport = props.step.departureTransport.type;

		this.editFunction = this.editFunction.bind(this);
		this.getLatLnt = this.getLatLnt.bind(this);
		this.addImgFile = this.addImgFile.bind(this)

		this.newCity = React.createRef();
		this.newName = React.createRef();
		this.newDate = React.createRef();
		this.newDateDepart = React.createRef();
		this.newDepartureTransport = React.createRef();
		this.newDescription = React.createRef();

		this.newLat = React.createRef();
		this.newLnt = React.createRef();
		this.boutonOK = React.createRef();
		this.modal = React.createRef();

		this.refHead = React.createRef();

		this.imgcontainer = React.createRef();
		this.inputphotoToReset = React.createRef();

		this.toggleModal = this.toggleModal.bind(this);
	}

	editFunction() {
		var listformat = [];
		//console.log(this.state.files);
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
			if (this.readyState === 4 && this.status === 200) {
				// maintenant on envoi le transport
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function () {
					console.log(this.responseText);
					if (this.readyState === 4 && this.status === 200) {
						//console.log("Upload transport etape success");
						parentVoyage.toggleModal();
						document.location.reload(true);
					}
				};

				xhttp.open("PATCH", "https://wtg.aymerik-diebold.fr" + JSON.parse(res).departureTransport, true);
				xhttp.setRequestHeader('Authorization', 'Bearer ' + parentVoyage.props.token);
				xhttp.setRequestHeader('Content-Type', 'application/merge-patch+json');
				xhttp.send(JSON.stringify({
					stageFrom: "/api/stages/" + JSON.parse(res).id,
					type: parentVoyage.newDepartureTransport.current.value,
					distance: 0
				}));

			}
		};

		xhttp.open("PATCH", "https://wtg.aymerik-diebold.fr/api/stages/" + this.state.id, true);
		xhttp.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
		xhttp.setRequestHeader('Content-Type', 'application/merge-patch+json');
		xhttp.send(JSON.stringify({
			city: this.newCity.current.value,
			country: "rien",
			mark: 0,
			description: this.newDescription.current.value,
			arrival: this.newDate.current.value,
			departure: this.newDateDepart.current.value,
			lng: this.state.newLat,
			lat: this.state.newLnt,
			title: this.newName.current.value,
			photos: listformat
		}));
    }

    deleteFunction() {
        var xhttp = new XMLHttpRequest();
        var parentVoyage = this;
        xhttp.onreadystatechange = function() {
            console.log(this.responseText);
            //var res = this.responseText;
            if (this.readyState === 4 && this.status === 204) {
                parentVoyage.toggleModal();
				document.location.reload(true);

            }
        };

        xhttp.open("DELETE", "https://wtg.aymerik-diebold.fr/api/stages/" + this.state.id, true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
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
		console.log("chargement");
		this.boutonOK.current.disabled = etat;
		if (etat === true)
			this.boutonOK.current.textContent = "Image upload in progress..."
		else
			this.boutonOK.current.textContent = "Add step"
		//console.log("change etat avec : ", etat);
	}

	toggleModal() {
		console.log("toggle modal edit");

		// change values inside the modal
		this.newName.current.value = this.state.title;
		this.newCity.current.value = this.state.city;
		this.newDate.current.value = this.state.arrival;
        this.newDateDepart.current.value = this.state.departure;
        console.log(this.state.departureTransport);
        //if (this.newDepartureTransport.current.value != "undefined") this.newDepartureTransport.current.value = this.state.departureTransport;
        //else this.newDepartureTransport.current.value = "";
        this.newDepartureTransport.current.value = this.state.departureTransport;
        this.newDescription.current.value = this.state.description;

		// toggle modal
		this.modal.current.classList.toggle("show-modal");
	}

	render() {
		//console.log("je suis dans editStep");
		return (
			<div>
				<div ref={this.modal} class="modal2">
					<div class="modal-content">
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

						<Upload key={"addStep" + this.props.stepKey} uploadID={"editStep" + this.props.stepKey} token={this.props.token} addImgFile={this.addImgFile} files={this.state.files} changeButtonState={this.changeButtonState.bind(this)} imgcontainer={this.imgcontainer} refInput={this.inputphotoToReset} />

						<button type="button" ref={this.boutonOK} onClick={this.editFunction.bind(this)}>Edit step</button>
                        <button type="button" ref={this.boutonDelete} onClick={this.deleteFunction.bind(this)}>Delete step</button>
					</div>
				</div>
				<button type="button" onClick={this.toggleModal}>Edit step</button>
			</div>
		);
	}
}

export default EditStep;
