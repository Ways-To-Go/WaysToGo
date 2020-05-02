import React, { Component } from "react";
import "./App.css";
import { EnteteVoyage } from "./ShowVoyage";
import ReactDOM from 'react-dom';

/*
 * https://stackoverflow.com/questions/14069421/show-an-image-preview-before-upload
 * https://stackoverflow.com/questions/55831213/uploading-multiple-images-with-react
 * https://medium.com/@650egor/react-30-day-challenge-day-2-image-upload-preview-2d534f8eaaa
 * 
 * https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
 * https://stackoverflow.com/questions/22245100/how-to-display-an-image-from-a-file-input
 * 
 */

// Gere l'ajout d'image et l'affichage
//https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
class Upload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			files: [] // contient l'ensemble des images
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		Array.prototype.forEach.call(event.target.files, (file) =>
			this.setState({
				files: [...this.state.files, ...event.target.files] // ajout des nouvelles images a ceux deja existantes
			})
		);
	}

	render() {
		return (
			<div id="imagesConteneur">
				{/* Display all selected images. */}
				{this.state.files && [...this.state.files].map((file) => (
					<img width="200px" height="200px" src={URL.createObjectURL(file)} />
				))}
				<input type="file" multiple onChange={this.handleChange} />

				{/*<label for="files">Ajouter des images à cette étape</label>
				<input id="files" style={{ visibility: "hidden" }} type="file" multiple onChange={this.handleChange} />*/}
			</div>
		);
	}
}

class UneEtape extends React.Component {
	render() {
		return (
			<div class="etapevoyage">
				<label for="lville">Ville</label>
				<input type="text" id="lville" name="lville" placeholder="Ville.."></input>

				<label for="nometape">Nom de l'étape</label>
				<input type="text" id="nometape" name="nometape" placeholder="ex. Promenade dans Paris"></input>

				<label for="larrivee">Date d'arrivée</label>
				<input type="text" id="larrivee" name="larrivee" placeholder="Arrivée.."></input>

				<label for="ldescription">Votre histoire</label>
				<textarea id="ldescription" name="ldescription" placeholder="Ce que vous voulez..."></textarea>

				<Upload />
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
			startdate: props.startdate,
			enddate: props.enddate,
			vegan: props.vegan,
			ecolo: props.ecolo
		};

		this.setTextInputRef = React.createRef();
	}

	addEtapeVoyage() {
		ReactDOM.render(<UneEtape />, this.setTextInputRef.current.appendChild(document.createElement('div')))
	}

	render() {
		return (
			<div id="information">
				<EnteteVoyage param={{ startdate: this.state.startdate.value, enddate: this.state.enddate.value, title: this.state.name.value, description: this.state.description.value, vegan: this.state.vegan, ecolo: this.state.ecolo, stages: [], author: { firstName: "Nicolas", lastName: "Dupond"}}} />
									
				<div ref={this.setTextInputRef}></div>
				<button type="button" onClick={this.addEtapeVoyage.bind(this)}>Ajouter une étape</button>
			</div>
		);
	}
}



class CreationVoyage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			description: props.description,
			startdate: props.startdate,
			enddate: props.enddate,
			addMyVoyage: props.addMyVoyage,
			vegan: props.vegan,
			ecolo: props.ecolo
		};
	}

	render() {
		return (
			<div class="formulaire">
				<h3>Nouveau voyage</h3>

				<div class="partie">
					<h4>Détails</h4>
					<div class="partiedetails">
						<p class="partieLabel">Nom du voyage:</p>
						<input required type="text" ref={this.state.name} id="fname" name="firstname" placeholder="ex. Un grand tour de la France"></input>

						<p class="partieLabel">Résumé du voyage:</p>
						<textarea required ref={this.state.description} id="lname" name="lastname" placeholder="ex. Un voyage bucolique à travers la campagne francaise : vieux vestiges et spécialités locales"></textarea>
					</div>
				</div>


				<div class="partie">
					<h4>Quand ?</h4>
					<div class="partiedetails">
						<p class="partieLabel">Date de début:</p>
						<input ref={this.state.startdate} type="date" id="start" name="trip-start" />

						<p class="partieLabel">Date de fin:</p>
						<input ref={this.state.enddate} type="date" id="end" name="trip-end" />
					</div>
				</div>


				<div class="partie">
					<h4>Paramétres</h4>
					<div class="partiedetails">
						<div>
							<input ref={this.state.vegan} type="checkbox" id="voyagevegan" name="voyagevegan" value="newsletter"></input>
							<label for="voyagevegan">Ce voyage est-il vegan ?</label>
						</div>

						<div>
							<input ref={this.state.ecolo} type="checkbox" id="voyageecolo" name="voyageecolo" value="newsletter"></input>
							<label for="voyageecolo">Ce voyage est-il ecologique ?</label>
						</div>
					</div>
				</div>


				<button type="button" class="boutonsend" onClick={this.state.addMyVoyage}>Ajouter le voyage</button>
			</div>
		);
	}
}



export default class AddVoyage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: props.id,
			titre: null,
			startNewVoyage: true,
			toRender: <h1>Chargement en cours...</h1>
		};

		this.description = React.createRef();
		this.name = React.createRef();
		this.startdate = React.createRef();
		this.enddate = React.createRef();
		this.vegan = React.createRef();
		this.ecolo = React.createRef();

		// Cette liaison est nécéssaire afin de permettre l'utilisation de `this` dans la fonction de rappel.
		this.addMyVoyage = this.addMyVoyage.bind(this);
	}

	addMyVoyage() {
		if (this.description.current.validity.valid && this.name.current.validity.valid &&
			this.startdate.current.validity.valid && this.enddate.current.validity.valid)
		this.setState({
			description: this.description.current.value,
			name: this.name.current.value,
			startdate: this.startdate.current.value,
			enddate: this.enddate.current.value,
			ecolo: this.ecolo.current.checked,
			vegan: this.vegan.current.checked,
			startNewVoyage: false
		})
		else alert("Veillez compléter les parties Détails et Quand")
	}
	
	render() {
		return (
			<div>
				<div class="topnav">
					<a href="/WaysToGo/">WaysToGo</a>
					<a class="active" href={"?show=save"}>Ajoutez un voyage</a>
					<a href="#contact">Contact</a>
					<a href="#about">About</a>
				</div>

				{this.state.startNewVoyage ?
					<CreationVoyage name={this.name} vegan={this.vegan} ecolo={this.ecolo} addMyVoyage={this.addMyVoyage} description={this.description} startdate={this.startdate} enddate={this.enddate} />
					:
					<CreationVoyageAjoutEtapes name={this.name.current} vegan={this.vegan.current.checked} ecolo={this.ecolo.current.checked} description={this.description.current} startdate={this.startdate.current} enddate={this.enddate.current} />
				}
			</div>
		);

	}
}
