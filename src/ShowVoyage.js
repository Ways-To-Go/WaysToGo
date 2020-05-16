import React, { Component } from "react";
import "./App.css";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import NavigationBar from "./NavigationBar";

// show the head of the trip
/* Need a parameter param like :
 * param = {
 * title = string
 * ?startdate = string in a good date format (aaaa-mm-dd)
 * vegan = bool
 * ecological = bool
 * author {
 *		firstName = string
 *		lastName = string
 *	}
 *	stages = list of stage
 * }
 */
export class EnteteVoyage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      param: props.param,
    };

    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  }

  /* TODO :
   * qui retourne le nombre de photos
   * qui retourne le nombre de pays ou passe le voyage
   */

  getStageNumber(etapes) {
    return etapes.length;
  }

  // retourne le mois de debut
  getDateDebut(etapes) {
    if (etapes.length > 0) {
      var d = new Date(etapes[0].departure);
      return this.monthNames[d.getMonth()];
    } else return null;
  }

  // retourne le mois de fin
  getDateFin(etapes) {
    if (etapes.length > 0) {
      var d = new Date(etapes[etapes.length - 1].arrival);
      return this.monthNames[d.getMonth()];
    } else return 0;
  }

  // retourne le nombre de jours
  getDureeVoyage1(etapes) {
    if (etapes.length > 0) {
      var d =
        new Date(etapes[etapes.length - 1].arrival) -
        new Date(etapes[0].departure);
      const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    } else return 0;
  }

  getDureeVoyage2(date1, date2) {
    var d = new Date(date2) - new Date(date1);
    const diffDays = Math.ceil(d / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  }

  // renvoi la date a afficher (mois - mois)
  getMonthsDate1(etapes) {
    if (etapes.length > 0) {
      var d = this.getDateDebut(etapes);
      var a = this.getDateFin(etapes);
      if (d !== a)
        return this.getDateDebut(etapes) + " - " + this.getDateFin(etapes);
      else return d;
    } else return "";
  }

  getMonthsDate2(date1, date2) {
    var d = new Date(date1);
    var a = new Date(date2);
    if (d.getMonth() !== a.getMonth())
      return (
        this.monthNames[d.getMonth()] + " - " + this.monthNames[a.getMonth()]
      );
    else return this.monthNames[d.getMonth()];
  }

  render() {
    return (
      <div ref={this.state.param.refHead} id="head">
        <h2>{this.state.param.title}</h2>
        <h5>
          {this.state.param.startdate
            ? ""
            : this.getMonthsDate1(this.state.param.stages)}
        </h5>
        <p class="ladescription">{'"' + this.state.param.description + '"'}</p>
        <p>
          {this.state.param.vegan
            ? "Ce voyage est vegan"
            : "Ce voyage est signalé comme non-vegan"}
        </p>
        <p>
          {this.state.param.ecological
            ? "Ce voyage est ecologique"
            : "Ce voyage est signalé comme non-ecologique"}
        </p>
        <p>
          auteur :{" "}
          {this.state.param.author.firstName +
            " " +
            this.state.param.author.lastName}
        </p>
        <p>
          Durée du voyage :{" "}
          {this.state.param.startdate
            ? this.getDureeVoyage2(
                this.state.param.startdate,
                this.state.param.enddate
              )
            : this.getDureeVoyage1(this.state.param.stages)}{" "}
          jours
        </p>
        {this.state.param.edit ? (
          <div>
            <label for="files2" style={{ border: "2px solid black" }}>
              Change cover image
            </label>
            <input
              id="files2"
              style={{ visibility: "hidden" }}
              ref={this.state.param.refHead}
              type="file"
              accept="image/*"
              onChange={this.state.param.changeCover}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

// render a step
export class EtapeVoyage extends React.Component {
  render() {
    return (
      <div>
        <div class="etape">
          <p class="nomEtape">{this.props.etape.description}</p>

          <p class="villedate_etape">
            {this.props.etape.city + " • " + new Date(this.props.etape.arrival)}
          </p>

          {this.props.etape.photos.map((photo, i) => (
            <div>
              <img
                key={i}
                src={photo.path}
                alt={photo.title}
                height="150"
                width="200"
              ></img>

              <p key={i}>{photo.description}</p>
            </div>
          ))}
        </div>

        {this.props.etape.departureTransport ? (
          <div class="transition_etape">
            <p class="transitionTexte">
              • Moyen de transport : {this.props.etape.departureTransport.type}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

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
      if (this.readyState === 4 && this.status === 200) {
        const param = JSON.parse(this.responseText);
        console.log("Voyage : " + param);
        parentVoyage.setState({
          toRender: (
            <div>
              <NavigationBar
                connected={parentVoyage.props.connected}
                connect={parentVoyage.props.connect}
              />
              <div id="carteSide">
                <Map id="ShowVoyageMap" center={[40.0, 3.0]} zoom={1}>
                  <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {param.stages.map((etape) => (
                    <Marker position={[etape.lng, etape.lat]}>
                      <Popup>
                        <h1>{etape.description}</h1>
                      </Popup>
                    </Marker>
                  ))}
                </Map>
              </div>

              <div id="information">
                <EnteteVoyage param={param} />

                <div id="etapes">
                  {console.log(param)}
                  {param.stages.map((etape) => (
                    <EtapeVoyage etape={etape} photos={etape.photos} />
                  ))}
                </div>
              </div>
            </div>
          ),
        });
      }
    };
    xhttp.open(
      "GET",
      "https://wtg.aymerik-diebold.fr/api/trips/" + parentVoyage.props.id,
      true
    );
    xhttp.send();
  }

  render() {
    let content = (
      <div>
        <div>{this.state.toRender}</div>
      </div>
    );
    return content;
  }
}

export default ShowVoyage;
