import React from "react";
import "./App.css";

// Gere l'ajout d'image et l'affichage. https://stackoverflow.com/questions/38049966/get-image-preview-before-uploading-in-react
export default class Upload extends React.Component {
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

		var parentUpload = this;
		var totalEndUpload = 0; // on desactive le bouton d'envoi. Quand toutes les images sont uploadées en ligne (totalEndUpload == images.length) on ré-active le bouton
		var images = event.target.files;
		[...event.target.files].map(function (file) {
			// senf img to imgbb for saving
			var xhttp = new XMLHttpRequest();
			var img = file;
			xhttp.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {

					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function () {
						if (this.readyState === 4 && this.status === 201) {
							console.log("Upload photo in API : success");

							parentUpload.props.addImgFile({ image: img, image_URL_BDD: "/api/photos/" + JSON.parse(this.responseText).id });
							totalEndUpload += 1;
							if (totalEndUpload == images.length) {
								parentUpload.props.changeButtonState(false);
							}
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
					{this.state.filesToShow && [...this.state.filesToShow].map((file, i) => (
						<img key={i} width="200px" height="200px" src={URL.createObjectURL(file)} alt="Image" />
					))}
				</div>
				<input id={this.props.uploadID} style={{ display: "none"}} ref={this.props.refInput} type="file" accept="image/*" multiple onChange={this.handleChange} />
				<label for={this.props.uploadID} class="custom-file-upload">
					Add images to this step
				</label>

			</div>
		);
	}
}