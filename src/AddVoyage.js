import React, { Component } from "react";
import "./App.css";
import { EnteteVoyage } from "./ShowVoyage";
import NavigationBar from "./NavigationBar";
import EditStep, { ButtonDeleteTrip } from "./editStep.js";
import AddStep from "./addStep";

class UneEtape extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			step: JSON.parse(props.etape)
		};
		this.state.step.departureTransport = { "type": props.transport };
		//console.log(this.state.step);
		this.refLocation = React.createRef();
		this.refName = React.createRef();
		this.refDate = React.createRef();
		this.refDescription = React.createRef();
		this.refDateDepart = React.createRef();
		this.refDepartureTransport = React.createRef();

		this.editEtapeVoyage = this.editEtapeVoyage.bind(this);
	}

	editEtapeVoyage(parameters) {
		//console.log(parameters);
		this.setState({
			step: parameters.etape
		})
		this.refLocation.current.innerHTML = parameters.city;
		this.refName.current.innerHTML = parameters.title;
		this.refDate.current.innerHTML = parameters.arrival;
		this.refDescription.current.innerHTML = parameters.description;
		this.refDateDepart.current.innerHTML = parameters.departure;
		this.refDepartureTransport.current.innerHTML = parameters.departureTransport.type;
		//console.log(parameters.departureTransport.type);
		//console.log(this.refDepartureTransport.current.innerHTML);
	}

	render() {
		return (
			<div class="etapevoyage">
				<EditStep key={this.props.editStepKey} reload={false} callback={this.editEtapeVoyage} stepKey={this.state.editStepKey} step={this.state.step} token={this.props.token} />
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
					<img key={this.props.editStepKey + i} width="200px" height="200px" src={URL.createObjectURL(file.image)} alt="Image" />
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
			files: [],
			allEtapes: []
		};

		this.setTextInputRef = React.createRef();

		this.inputphotoToReset = React.createRef();
		this.imgcontainer = React.createRef();

		this.changeEnteteBackground = this.changeEnteteBackground.bind(this);
		this.addEtapeVoyage = this.addEtapeVoyage.bind(this);

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

	// TODO
	// A CHANGER ICI ! ET REFAIRE LE EDIT
	addEtapeVoyage(parameters) {
		//console.log(parameters);
		this.setState({
			allEtapes: [...this.state.allEtapes, {
				"files": parameters.photos,
				"description": parameters.description,
				"date": parameters.arrival,
				"dateDepart": parameters.departure,
				"location": parameters.city,
				"departureTransport": parameters.transport,
				"name": parameters.title,
				"etape": parameters.etape
			}
			]
		})
		/*ReactDOM.render(<UneEtape arguments={
			{
				"location": parameters.city,
				"files": parameters.photos,
				"description": parameters.description,
				"date": parameters.arrival,
				"dateDepart": parameters.departure,
				"departureTransport": parameters.transport,
				"name": parameters.title
			}} editStepKey={"addVoyage"} etape={parameters.etape} token={this.props.token} />, this.setTextInputRef.current.appendChild(document.createElement('div')));
			*/
	}

	changeEnteteBackground(event) {
		// linear black gradient to blacker the img
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
				{this.state.allEtapes.map((etape, i) => (
					<UneEtape arguments={etape} key={"UneEtape" + i} transport={etape.departureTransport} editStepKey={"addVoyage" + i} etape={etape.etape} token={this.props.token} />
				))}

				<AddStep reload={false} callback={this.addEtapeVoyage} tripId={this.props.voyageId} key={"addVoyage"} stepKey={"addVoyage"} token={this.props.token} />
			</div>
		);
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

		this.addMyVoyage = this.addMyVoyage.bind(this)
	}

	addMyVoyage(newname, newdescription, newvegan, newecolo) {
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
				alert("Connection time out. Please reconnect");
				//console.log(parentVoyage.state.token)
				//parentVoyage.renouvelerToken();
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
						<h2>Chargement</h2>
					:
					<CreationVoyageAjoutEtapes token={this.state.token} voyageId={this.state.voyageId} name={this.state.name} vegan={this.state.vegan} ecolo={this.state.ecolo} description={this.state.description} />
				}
			</div>
		);

	}
}
