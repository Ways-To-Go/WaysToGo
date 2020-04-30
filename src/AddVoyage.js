import React, { Component } from "react";
import "./App.css";


export default class AddVoyage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: props.id,
			titre: null,
			toRender: <h1>Chargement en cours...</h1>,
		};

		this.setTextInputRef = React.createRef();

		// Cette liaison est nécéssaire afin de permettre    
		// l'utilisation de `this` dans la fonction de rappel.
		this.addEtapeVoyage = this.addEtapeVoyage.bind(this);
	}

	addEtapeVoyage() {
		this.setTextInputRef.current.innerHTML += `
			<div>
				<label for="lville">Ville</label>
				<input type="text" id="lville" name="lville" placeholder="Ville.."></input>

				<label for="lpays">Pays</label>
				<input type="text" id="lpays" name="lpays" placeholder="Pays.."></input>

				<label for="ldescription">Description</label>
				<input type="text" id="ldescription" name="ldescription" placeholder="Description.."></input>

				<label for="larrivee">Arrivée</label>
				<input type="text" id="larrivee" name="larrivee" placeholder="Arrivée.."></input>

				<label for="ldepart">Départ</label>
				<input type="text" id="ldepart" name="ldepart" placeholder="Départ.."></input>

			</div>
		`;
	}


	render() {
		return (
			<div>
				<div class="topnav">
					<a href="/">WaysToGo</a>
					<a class="active" href={"?show=save"}>Ajoutez un voyage</a>
					<a href="#contact">Contact</a>
					<a href="#about">About</a>
				</div>

				<div class="formulaire">
					<h3>CrÃ©er un nouveau voyage</h3>

					<form action="/action_page.php">
						<label for="fname">Nom de votre voyage</label>
						<input type="text" id="fname" name="firstname" placeholder="Nom.."></input>

						<label for="lname">Description</label>
						<input type="text" id="lname" name="lastname" placeholder="Description.."></input>

						<div>
							<input type="checkbox" id="voyagevegan" name="voyagevegan" value="newsletter"></input>
							<label for="voyagevegan">Ce voyage est-il vegan ?</label>
						</div>

						<div>
							<input type="checkbox" id="voyageecolo" name="voyagevegan" value="newsletter"></input>
							<label for="voyageecolo">Ce voyage est-il ecologique ?</label>
						</div>

						<div ref={this.setTextInputRef}></div>
						<button type="button" onClick={this.addEtapeVoyage}>Ajouter une Ã©tape</button>

						<input type="submit" value="Submit"></input>
					</form>
				</div>
			</div>
		);
	}
}