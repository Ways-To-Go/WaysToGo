import React, { Component } from "react";
//import ReactDom from 'react-dom'
//import ObjectList from 'react-object-list'
//import { List } from 'react-object-list/renderers'
import "./App.css";
import NavigationBar from './NavigationBar';



class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            city: props.city,
            title: props.title,
            keyword: props.keyword,
            chercher: props.chercher,
        };
    }

    render() {
        return (
            <div class="formulaire">

                <div class="partiedetails">
                    <p class="partieLabel">Title:</p>
                    <input required type="text" ref={this.state.title} id="title" name="title" placeholder=""></input>
                </div>

                <div class="partiedetails">
                    <p class="partieLabel">Keyword:</p>
                    <input required type="text" ref={this.state.keyword} id="keyword" name="keyword" placeholder="ex. Paris"></input>
                </div>

                <div class="partiedetails">
                    <p class="partieLabel">City:</p>
                    <input required type="text" ref={this.state.city} id="rcity" name="city" placeholder="ex. Rome"></input>
                </div>

                <button type="button" class="boutonsend" onClick={this.state.chercher}>Chercher</button>
            </div>
        );
    }
}

class ResultList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            city: props.city,
            keyword: props.keyword,
            title: props.title,
            voyages: [],
        };

        this.loadDoc(this);
    }

    loadDoc(parentThis) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                parentThis.setState({
                    voyages: JSON.parse(this.response)['hydra:member'],
                });
                //console.log(parentThis.state.voyages);
            }
        };
        
        var url = "https://wtg.aymerik-diebold.fr/api/trips?";
        var firstParam = true;
        if (parentThis.state.title.length > 0) {
            url = url.concat("title=", parentThis.state.title);
            firstParam = false;
        };
        if (parentThis.state.keyword.length > 0) {
            if (!firstParam) {
                url = url.concat("&");
            };
            url = url.concat("keywords=", parentThis.state.keyword);
            firstParam = false;
        };
        if (parentThis.state.city.length > 0) {
            if (!firstParam) {
                url = url.concat("&");
            };
            url = url.concat("stages.city=",parentThis.state.city);
        };

        xhttp.open("GET",url, true);
        xhttp.send();
    };

    render() {
        return (
            <div>
                <div id="recherche">
                    <h4> Results of
                    <ul>
                            <li>Title: "{this.state.title}" </li>
                            <li>Keyword: "{this.state.keyword}" </li>
                            <li>City: "{this.state.city}" </li>
                        </ul>
                    </h4>
                </div>

                <div id='table'>
                    <table>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Description</th>
                            <th>Vegan</th>
                            <th>Ecological</th>
                            <th>Lien</th>
                        </tr>

                        {this.state.voyages.map((voyage) => (
                            <tr>
                                <td>{voyage.title}</td>
                                <td>{voyage.author.firstName} {voyage.author.lastNqme}</td>
                                <td>{voyage.description}</td>
                                <td><a href={"?show=trip&id=" + voyage.id}>Cliquez</a></td>
                            </tr>
                        ))}

                    </table>
                </div>

            </div>
        )
    }


}



export default class SearchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            startNewSearch: true,
            toRender: <h1>Chargement en cours...</h1>
        };

        this.city = React.createRef();
        this.title = React.createRef();
        this.keyword = React.createRef();

        // Cette liaison est nécéssaire afin de permettre l'utilisation de `this` dans la fonction de rappel.
        this.chercher = this.chercher.bind(this);
    }

    chercher() {
        if (this.city.current.validity.valid || this.title.current.validity.valid ||
            this.keyword.current.validity.valid)
            this.setState({
                city: this.city.current.value,
                keyword: this.keyword.current.value,
                title: this.title.current.value,
                startNewSearch: false,
            })
        else alert("Veillez completer au moins un champ pour chercher")
    }

    render() {
        return (
            <div>
                <NavigationBar active="5" />

                {this.state.startNewSearch ?
                    <SearchForm city={this.city} title={this.title} keyword={this.keyword} chercher={this.chercher} />
                    :
                    <ResultList city={this.city.current.value} title={this.title.current.value} keyword={this.keyword.current.value} />

                }
            </div>
        );

    }
}