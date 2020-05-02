(this.webpackJsonpwaystogo=this.webpackJsonpwaystogo||[]).push([[0],{15:function(e,t,a){},30:function(e,t,a){e.exports=a(49)},35:function(e,t,a){},49:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(12),l=a.n(i),s=(a(35),a(6)),c=a(7),o=a(9),u=a(8),d=(a(15),a(11)),m=a(51),h=a(52),p=a(50),v=a(53),g=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={param:e.param},n.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"],n}return Object(c.a)(a,[{key:"getDateDebut",value:function(e){if(e.length>0){var t=new Date(e[0].departure);return this.monthNames[t.getMonth()]}return null}},{key:"getDateFin",value:function(e){if(e.length>0){var t=new Date(e[e.length-1].arrival);return this.monthNames[t.getMonth()]}return 0}},{key:"getDureeVoyage",value:function(e){if(e.length>0){var t=new Date(e[e.length-1].arrival)-new Date(e[0].departure);return Math.ceil(t/864e5)+1}return 0}},{key:"getDureeVoyage",value:function(e,t){var a=new Date(t)-new Date(e);return Math.ceil(a/864e5)+1}},{key:"getMonthsDate",value:function(e){var t=this.getDateDebut(e);return t!=this.getDateFin(e)?this.getDateDebut(e)+" - "+this.getDateFin(e):t}},{key:"getMonthsDate",value:function(e,t){var a=new Date(e),n=new Date(t);return a.getMonth()!=n.getMonth()?this.monthNames[a.getMonth()]+" - "+this.monthNames[n.getMonth()]:this.monthNames[a.getMonth()]}},{key:"render",value:function(){return r.a.createElement("div",{id:"head"},r.a.createElement("h2",null,this.state.param.title),r.a.createElement("h5",null,this.state.param.startdate?this.getMonthsDate(this.state.param.startdate,this.state.param.enddate):this.getMonthsDate(this.state.param.stages)),r.a.createElement("p",{class:"ladescription"},'"'+this.state.param.description+'"'),r.a.createElement("p",null,this.state.param.vegan?"Ce voyage est vegan":"Ce voyage est signal\xe9 comme non-vegan"),r.a.createElement("p",null,this.state.param.ecological?"Ce voyage est ecologique":"Ce voyage est signal\xe9 comme non-ecologique"),r.a.createElement("p",null,"auteur : ",this.state.param.author.firstName+" "+this.state.param.author.lastName),r.a.createElement("p",null,"Dur\xe9e du voyage : ",this.state.param.startdate?this.getDureeVoyage(this.state.param.startdate,this.state.param.enddate):this.getDureeVoyage(this.state.param.stages)," jours"))}}]),a}(n.Component),y=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).loadDoc(Object(d.a)(n)),n.state={id:e.id,titre:null,toRender:r.a.createElement("h1",null,"Chargement en cours...")},n}return Object(c.a)(a,[{key:"loadDoc",value:function(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var t=JSON.parse(this.responseText);e.setState({toRender:r.a.createElement("div",null,r.a.createElement("div",{id:"carteSide"},r.a.createElement(m.a,{id:"ShowVoyageMap",center:[40,3],zoom:2},r.a.createElement(h.a,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),r.a.createElement(p.a,{position:[40,3]},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Nom \xe0 venir"),r.a.createElement("a",{href:"?show=trip&id=1"},"Cliquez"))))),r.a.createElement("div",{id:"information"},r.a.createElement(g,{param:t}),r.a.createElement("div",{id:"etapes"},t.stages.map((function(e){return r.a.createElement("div",null,r.a.createElement("div",{class:"etape"},r.a.createElement("p",{class:"nomEtape"},e.description),r.a.createElement("p",{class:"villedate_etape"},e.city+" \u2022 "+new Date(e.arrival)),e.photos.map((function(e){return r.a.createElement("div",null,r.a.createElement("img",{src:e.path,alt:e.title,height:"150",width:"200"}),r.a.createElement("p",null,e.description))}))),e.departureTransport?r.a.createElement("div",{class:"transition_etape"},r.a.createElement("p",{class:"transitionTexte"},"\u2022 Moyen de transport : ",e.departureTransport.type)):"")})))))})}},t.open("GET","https://wtg.aymerik-diebold.fr/api/trips/"+e.props.id,!0),t.send()}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",null,this.state.toRender))}}]),a}(n.Component),f=a(21),E=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={files:[]},n.handleChange=n.handleChange.bind(Object(d.a)(n)),n}return Object(c.a)(a,[{key:"handleChange",value:function(e){var t=this;Array.prototype.forEach.call(e.target.files,(function(a){return t.setState({files:[].concat(Object(f.a)(t.state.files),Object(f.a)(e.target.files))})}))}},{key:"render",value:function(){return r.a.createElement("div",{id:"imagesConteneur"},this.state.files&&Object(f.a)(this.state.files).map((function(e){return r.a.createElement("img",{width:"200px",height:"200px",src:URL.createObjectURL(e)})})),r.a.createElement("input",{type:"file",multiple:!0,onChange:this.handleChange}))}}]),a}(r.a.Component),b=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(){return Object(s.a)(this,a),t.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{class:"etapevoyage"},r.a.createElement("label",{for:"lville"},"Ville"),r.a.createElement("input",{type:"text",id:"lville",name:"lville",placeholder:"Ville.."}),r.a.createElement("label",{for:"nometape"},"Nom de l'\xe9tape"),r.a.createElement("input",{type:"text",id:"nometape",name:"nometape",placeholder:"ex. Promenade dans Paris"}),r.a.createElement("label",{for:"larrivee"},"Date d'arriv\xe9e"),r.a.createElement("input",{type:"text",id:"larrivee",name:"larrivee",placeholder:"Arriv\xe9e.."}),r.a.createElement("label",{for:"ldescription"},"Votre histoire"),r.a.createElement("textarea",{id:"ldescription",name:"ldescription",placeholder:"Ce que vous voulez..."}),r.a.createElement(E,null))}}]),a}(r.a.Component),O=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={name:e.name,description:e.description,startdate:e.startdate,enddate:e.enddate,vegan:e.vegan,ecolo:e.ecolo},n.setTextInputRef=r.a.createRef(),n}return Object(c.a)(a,[{key:"addEtapeVoyage",value:function(){l.a.render(r.a.createElement(b,null),this.setTextInputRef.current.appendChild(document.createElement("div")))}},{key:"render",value:function(){return r.a.createElement("div",{id:"information"},r.a.createElement(g,{param:{startdate:this.state.startdate.value,enddate:this.state.enddate.value,title:this.state.name.value,description:this.state.description.value,vegan:this.state.vegan,ecolo:this.state.ecolo,stages:[],author:{firstName:"Nicolas",lastName:"Dupond"}}}),r.a.createElement("div",{ref:this.setTextInputRef}),r.a.createElement("button",{type:"button",onClick:this.addEtapeVoyage.bind(this)},"Ajouter une \xe9tape"))}}]),a}(r.a.Component),j=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={name:e.name,description:e.description,startdate:e.startdate,enddate:e.enddate,addMyVoyage:e.addMyVoyage,vegan:e.vegan,ecolo:e.ecolo},n}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement("div",{class:"formulaire"},r.a.createElement("h3",null,"Nouveau voyage"),r.a.createElement("div",{class:"partie"},r.a.createElement("h4",null,"D\xe9tails"),r.a.createElement("div",{class:"partiedetails"},r.a.createElement("p",{class:"partieLabel"},"Nom du voyage:"),r.a.createElement("input",{required:!0,type:"text",ref:this.state.name,id:"fname",name:"firstname",placeholder:"ex. Un grand tour de la France"}),r.a.createElement("p",{class:"partieLabel"},"R\xe9sum\xe9 du voyage:"),r.a.createElement("textarea",{required:!0,ref:this.state.description,id:"lname",name:"lastname",placeholder:"ex. Un voyage bucolique \xe0 travers la campagne francaise : vieux vestiges et sp\xe9cialit\xe9s locales"}))),r.a.createElement("div",{class:"partie"},r.a.createElement("h4",null,"Quand ?"),r.a.createElement("div",{class:"partiedetails"},r.a.createElement("p",{class:"partieLabel"},"Date de d\xe9but:"),r.a.createElement("input",{ref:this.state.startdate,type:"date",id:"start",name:"trip-start"}),r.a.createElement("p",{class:"partieLabel"},"Date de fin:"),r.a.createElement("input",{ref:this.state.enddate,type:"date",id:"end",name:"trip-end"}))),r.a.createElement("div",{class:"partie"},r.a.createElement("h4",null,"Param\xe9tres"),r.a.createElement("div",{class:"partiedetails"},r.a.createElement("div",null,r.a.createElement("input",{ref:this.state.vegan,type:"checkbox",id:"voyagevegan",name:"voyagevegan",value:"newsletter"}),r.a.createElement("label",{for:"voyagevegan"},"Ce voyage est-il vegan ?")),r.a.createElement("div",null,r.a.createElement("input",{ref:this.state.ecolo,type:"checkbox",id:"voyageecolo",name:"voyageecolo",value:"newsletter"}),r.a.createElement("label",{for:"voyageecolo"},"Ce voyage est-il ecologique ?")))),r.a.createElement("button",{type:"button",class:"boutonsend",onClick:this.state.addMyVoyage},"Ajouter le voyage"))}}]),a}(r.a.Component),w=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(s.a)(this,a),(n=t.call(this,e)).state={id:e.id,titre:null,startNewVoyage:!0,toRender:r.a.createElement("h1",null,"Chargement en cours...")},n.description=r.a.createRef(),n.name=r.a.createRef(),n.startdate=r.a.createRef(),n.enddate=r.a.createRef(),n.vegan=r.a.createRef(),n.ecolo=r.a.createRef(),n.addMyVoyage=n.addMyVoyage.bind(Object(d.a)(n)),n}return Object(c.a)(a,[{key:"addMyVoyage",value:function(){this.description.current.validity.valid&&this.name.current.validity.valid&&this.startdate.current.validity.valid&&this.enddate.current.validity.valid?this.setState({description:this.description.current.value,name:this.name.current.value,startdate:this.startdate.current.value,enddate:this.enddate.current.value,ecolo:this.ecolo.current.checked,vegan:this.vegan.current.checked,startNewVoyage:!1}):alert("Veillez compl\xe9ter les parties D\xe9tails et Quand")}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("div",{class:"topnav"},r.a.createElement("a",{href:"/WaysToGo/"},"WaysToGo"),r.a.createElement("a",{class:"active",href:"?show=save"},"Ajoutez un voyage"),r.a.createElement("a",{href:"#contact"},"Contact"),r.a.createElement("a",{href:"#about"},"About")),this.state.startNewVoyage?r.a.createElement(j,{name:this.name,vegan:this.vegan,ecolo:this.ecolo,addMyVoyage:this.addMyVoyage,description:this.description,startdate:this.startdate,enddate:this.enddate}):r.a.createElement(O,{name:this.name.current,vegan:this.vegan.current.checked,ecolo:this.ecolo.current.checked,description:this.description.current,startdate:this.startdate.current,enddate:this.enddate.current}))}}]),a}(n.Component),D=a(28),k=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(s.a)(this,a),(n=t.call(this,e)).state={liste_voyage:[],villes:["Paris","Madrid"],voyages:[],lat:48.856614,lng:2.3522219,zoom:2},n.loadDoc(Object(d.a)(n));var r=new D.OpenStreetMapProvider;return n.state.villes.map((function(e){return r.search({query:e}).then((function(t){return n.setState({liste_voyage:n.state.liste_voyage.concat([t,e])})}))})),n}return Object(c.a)(a,[{key:"loadDoc",value:function(e){var t=new XMLHttpRequest;t.onreadystatechange=function(){4==this.readyState&&200==this.status&&e.setState({voyages:JSON.stringify(this.response)})},t.open("GET","http://wtg.aymerik-diebold.fr/api/trips",!0),t.send()}},{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement("div",{class:"topnav"},r.a.createElement("a",{class:"active",href:"/WaysToGo/"},"WaysToGo"),r.a.createElement("a",{href:"?show=save"},"Ajoutez un voyage"),r.a.createElement("a",{href:"#contact"},"Contact"),r.a.createElement("a",{href:"#about"},"About")),r.a.createElement(m.a,{id:"principalMap",center:[this.state.lat,this.state.lng],zoom:this.state.zoom},r.a.createElement(h.a,{attribution:'&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}),this.state.liste_voyage.map((function(e,t){return void 0!=e[0].x?r.a.createElement(p.a,{position:[e[0].y,e[0].x]},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Nom \xe0 venir"),r.a.createElement("a",{href:"?show=trip&id=1"},"Cliquez"))):""}))))}}]),a}(n.Component),M=function(e){Object(o.a)(a,e);var t=Object(u.a)(a);function a(e){var n;Object(s.a)(this,a),n=t.call(this,e);var r=new URLSearchParams(window.location.search);return n.state={pageActuelle:r.get("show"),trip:r.get("id")},n}return Object(c.a)(a,[{key:"render",value:function(){return"trip"===this.state.pageActuelle?r.a.createElement(y,{id:this.state.trip}):"save"===this.state.pageActuelle?r.a.createElement(w,null):r.a.createElement(k,null)}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(M,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[30,1,2]]]);
//# sourceMappingURL=main.e6cf1ee2.chunk.js.map