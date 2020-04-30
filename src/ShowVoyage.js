import React, { Component } from "react";
import "./App.css";


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
						<div id="information">
							<div id="head">
								<h2>{param.title}</h2>
								<p>{param.description}</p>
								<p>{param.vegan ? "Ce voyage est vegan" : "Ce voyage est signalé comme non-vegan"}</p>
								<p>{param.ecological ? "Ce voyage est ecologique" : "Ce voyage est signalé comme non-ecologique"}</p>
								<p>auteur : {param.author.firstName + " " + param.author.lastName}</p>
							</div>

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