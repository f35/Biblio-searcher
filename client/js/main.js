if (Meteor.isClient) {

    Session.set('AuxCargS', 0);

    var _logout = Meteor.logout;
    Meteor.logout = function customLogout() {
        // Do your thing here
        // window.open('/',"_self" );
        // alert ("Salio");
        _logout.apply(Meteor, arguments);
        window.open('/', "_self");
    }

    /* Accounts.onLogin  = function customhello () {
     alert ("Hola");
     }*/
    /*
     Meteor.login = function customLogin() {
     // Do your thing here
     // window.open('/',"_self" );
     alert ("Salio");
     // _logout.apply(Meteor, arguments);
     //window.open('/',"_self" );
     }*/



    window.d3 = require("d3");
    window.d3pie = require("d3pie");
    Session.set('auxAct', 0);
    SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function (toElement) {
        return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };
    //Suscribe to Collections
    Tracker.autorun(function () {
        Meteor.subscribe("statsc");
        Meteor.subscribe("allproperties");
        Meteor.subscribe("endpoints");
        Meteor.subscribe("queries");
        Meteor.subscribe("prefixes");
        Meteor.subscribe("profile");
        Meteor.subscribe("searchs");
        Meteor.subscribe("favresources");
        Meteor.subscribe("recomendation");
        // Meteor.subscribe("cache");

    });

    this.App = {};
    this.Statsc = new Meteor.Collection("statsc");
    this.Graphs = new Meteor.Collection("graphs");
    this.Properties = new Meteor.Collection("properties");
    this.Prefixes = new Meteor.Collection("prefixes");
    this.Endpoints = new Meteor.Collection("endpoints");
    this.Queries = new Meteor.Collection("queries");
    this.Profile = new Meteor.Collection("profile");
    this.Searchs = new Meteor.Collection("searchs");
    this.Recomendation = new Meteor.Collection("recomendation");
    this.Favresources = new Meteor.Collection("favresources");
    this.App.resultCollection = new Meteor.Collection(null);
    this.App.resultCollectionSL = new Meteor.Collection(null);
    this.App.resultCollection2 = new Meteor.Collection(null);
    this.App.resultCollection3 = new Meteor.Collection(null);
    this.App.FindRepository = (function (uri) {

        var answer = {};
        var q = 'ask { <' + uri + '> ?a ?b }';
        var ep = Endpoints.find({status: 'A'}).fetch();
        for (var m = 0; m < ep.length; m++) {
            var r = Query(ep[m].endpoint, ep[m].graphURI, q);
            if (r) {
                var exists = JSON.parse(r.content).boolean;
                if (exists) {
                    answer = ep[m];
                    break;
                } else {
                }
            }
        }
        return answer;
    });

    var Qmode = 0;
    var pa = -1;
    this.App.SearchRun = (function (num, qm) {
        var jsonRequest = Session.get("jsonRequest");
        var offset = num * 10;
        jsonRequest['offset'] = offset;
        //alert('i');
        waitingDialog.show();
        Meteor.call('doQueryCache', jsonRequest, function (error, result) {



            if (result.statusCode != 200) {
                console.log(result.stack);
                $('#modalLog .console-log').html(result.stack ? (result.stack.replace(/[<]/g, '&#60;').replace(/[\n\r]/g, '<br/>')) : '');
                //$('#sparqlEditor button#consoleError').show();
                var message = result.msg + (result.stack ? (': ' + result.stack.substring(0, 30) + '...') : '');
                $('.top-right').notify({
                    message: {text: message},
                    type: 'danger'
                }).show();
            } else {
                if (result.resultSet) {
                    if (qm > 0) {
                        pa = -1;
                        Session.set("NResult", result.resultCount);
                        if (qm != 3) {
                            //$("#fac").empty();;


                            Session.set("BResult", true);
                            Session.set("facetedTotals", null);
                            Session.set("facetedTotalsN", null);

                            Qmode = qm;

                            Meteor.call('findbase', function (errorddd, resultdd) {
                                Session.set("BResult", result.resultCount > 0);
                                Session.set("facetedTotals", result.facetedTotals);

                            });


                        } else {
                            Session.set("facetedTotalsN", result.facetedTotalsN);
                            Meteor.call('findbase', function (errorddd, resultdd) {
                                facetedRange();
                            });
                        }
                    }
                    App.resultCollection2.remove({});
                    App.resultCollection2.insert(result.resultSet);
                }
            }
            //alert('f');
            waitingDialog.hide();

        });
        return "";
    });
    Template.stats.helpers({
        g1: function () {
            var str = {};
            var data = Statsc.find({cod: 1}).fetch();
            if (Statsc && data && data[0] && data[0].val) {

                data = data[0];
                data = data.val;
                var C = 0;
                var D = 0;
                var P = 0;
                for (var i = 0; i < data.length; i++) {
                    C += Number(data[i].C.value);
                    D += Number(data[i].D.value);
                    P += Number(data[i].P.value);
                }
                str = [{value: C, label: lang.lang("Collections")}, {value: D, label: lang.lang("Documents")}, {value: P, label: lang.lang("Persons")}];
            } else {
                str = [{value: 100, label: "Something"}];
            }
            $('#ResourcesChart').empty();
            try {
                // if ($('#ResourcesChart').length == 0) {
                //     return str;
                //  }

                //ResourcesChart
                var pie = new d3pie("ResourcesChart", {
                    "header": {
                        "title": {
                            "text": lang.lang("title-g1"),
                            "fontSize": 22,
                            "font": "verdana"
                        },
                        "subtitle": {
                            "text": lang.lang("sub-title-g1"),
                            "color": "#999999",
                            "fontSize": 10,
                            "font": "verdana"
                        },
                        "titleSubtitlePadding": 12
                    },
                    "footer": {
                        "color": "#999999",
                        "fontSize": 11,
                        "font": "open sans",
                        "location": "bottom-center"
                    },
                    "size": {
                        "canvasHeight": 300,
                        "canvasWidth": $('#ResourcesChart').width(),
                        "pieOuterRadius": "80%"
                    },
                    "data": {
                        "sortOrder": "label-asc",
                        "content": str
                    },
                    "labels": {
                        "outer": {
                            "pieDistance": 5
                        },
                        "inner": {
                            "hideWhenLessThanPercentage": 3
                        },
                        "mainLabel": {
                            "font": "verdana"
                        },
                        "percentage": {
                            "color": "#000000",
                            "font": "verdana",
                            "decimalPlaces": 0
                        },
                        "value": {
                            "color": "#e1e1e1",
                            "font": "verdana"
                        },
                        "lines": {
                            "enabled": true,
                            "style": "straight"
                        },
                        "truncation": {
                            "enabled": true
                        }
                    },
                    "effects": {
                        "pullOutSegmentOnClick": {
                            "effect": "linear",
                            "speed": 400,
                            "size": 8
                        }
                    },
                    "tooltips": {
                        "enabled": true,
                        "type": "placeholder",
                        "string": "{label}: {value}, {percentage}%"
                    },
                    "callbacks": {
                        onClickSegment: function (a) {
                            switch (a.index) {
                                case 0:
                                    {
                                        window.open("/buscador/stats#p_4", "_self");
                                    }
                                    break;
                                case 1:
                                    {
                                        window.open("/buscador/stats#p_2", "_self");
                                    }
                                    break;
                                case 2:
                                    {
                                        window.open("/buscador/stats#p_3", "_self");
                                    }
                                    break;

                            }
                        }
                    }
                });
            } catch (az) {
                //console.log(az);
            }
            return str;
        },
        g2: function () {
            var str = {};
            var data = Statsc.find({cod: 1}).fetch();
            if (Statsc && data && data[0] && data[0].val) {
                data = data[0];
                data = data.val;
                var C = 0;
                var D = 0;
                var P = 0;
                str = [];
                for (var i = 0; i < data.length; i++) {
                    C = Number(data[i].C.value);
                    D = Number(data[i].D.value);
                    P = Number(data[i].P.value);
                    var T = C + D + P;
                    str.push({value: T, label: "" + data[i].EP.value});
                }
                //str = [{y:C,indexLabel:"Collections"},{y:D,indexLabel:"Documents"},{y:P,indexLabel:"Persons"}];
            } else {
                str = [{value: 100, label: "Something"}];
            }
            $('#RepositoriesChart').empty();
            try {
                if ($('#RepositoriesChart').length == 0) {
                    return str;
                }

                var pie = new d3pie("RepositoriesChart", {
                    "header": {
                        "title": {
                            "text": lang.lang("title-g2"),
                            "fontSize": 22,
                            "font": "verdana"
                        },
                        "subtitle": {
                            "text": lang.lang("sub-title-g2"),
                            "color": "#999999",
                            "fontSize": 10,
                            "font": "verdana"
                        },
                        "titleSubtitlePadding": 12
                    },
                    "footer": {
                        "color": "#999999",
                        "fontSize": 11,
                        "font": "open sans",
                        "location": "bottom-center"
                    },
                    "size": {
                        "canvasHeight": 300,
                        "canvasWidth": $('#RepositoriesChart').width(),
                        "pieOuterRadius": "80%"
                    },
                    "data": {
                        "sortOrder": "random",
                        "content": str
                    },
                    "labels": {
                        "outer": {
                            "pieDistance": 5
                        },
                        "inner": {
                            "hideWhenLessThanPercentage": 3
                        },
                        "mainLabel": {
                            "font": "verdana"
                        },
                        "percentage": {
                            "color": "#000000",
                            "font": "verdana",
                            "decimalPlaces": 0
                        },
                        "value": {
                            "color": "#e1e1e1",
                            "font": "verdana"
                        },
                        "lines": {
                            "enabled": true,
                            "style": "straight"
                        },
                        "truncation": {
                            "enabled": true
                        }
                    },
                    "effects": {
                        "pullOutSegmentOnClick": {
                            "effect": "linear",
                            "speed": 400,
                            "size": 8
                        }
                    },
                    "tooltips": {
                        "enabled": true,
                        "type": "placeholder",
                        "string": "{label}: {value}, {percentage}%"
                    }
                });



            } catch (az) {
            }
            return str;
        },
        g3: function () {
            var data = Statsc.find({cod: 2}).fetch();
            var frequency_list = [];

            if (data && data[0]) {
                data = data[0].val;
                var max = 0;
                for (var q = 0; q < data.length; q++) {
                    var words1 = data[q].Data;
                    for (var w = 0; w < words1.length; w++) {
                        //console.log(words1[w].D.value.trim());
                        var ex = frequency_list.filter(function (a) {
                            return a.text.trim() === words1[w].D.value.trim();
                        });
                        if (ex.length == 0) {
                            frequency_list.push({text: words1[w].D.value + '', size: Number(words1[w].cou.value) + 0});
                            if (Number(words1[w].cou.value) > max) {
                                max = Number(words1[w].cou.value);
                            }
                        } else {
                            ex[0].size += Number(words1[w].cou.value);
                            if (ex[0].size > max) {
                                max = ex[0].size;
                            }
                        }
                    }
                }
                frequency_list = _.sample(frequency_list, 25);


                for (var q = 0; q < frequency_list.length; q++) {
                    frequency_list[q].size = (frequency_list[q].size / max) * 15 + 10;
                }
            } else {
                frequency_list = [{"text": "study", "size": 40}, {"text": "motion", "size": 15}];
            }



            try {
                if ($('#lstags').length == 0 || $('#myCanvas').length == 0 || $('#SubjectsChart').length == 0) {
                    return str;
                }

                $('#lstags').empty();
                var ul = document.getElementById("lstags");

                for (var i = 0; i < frequency_list.length; i++) {
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    var txt = document.createTextNode(frequency_list[i].text);
                    a.appendChild(txt);
                    a.setAttribute("data-weight", "" + frequency_list[i].size);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                TagCanvas.Start('myCanvas', 'tags', {
                    textColour: '#000000',
                    outlineColour: '#ff00ff',
                    reverse: true,
                    depth: 1.0,
                    weight: true,
                    weightFrom: 'data-weight',
                    initial: [0.0, -0.05],
                    maxSpeed: 0.05,
                    shadow: '#ccf',
                    shadowBlur: 3
                });
            } catch (e) {
                // something went wrong, hide the canvas container
                //document.getElementById('SubjectsChart').style.display = 'none';
            }




            return frequency_list;



        },
        g4: function () {
            Session.get('auxAct');
            var e = document.getElementById("groupby_doc");
            var strUser = (e) ? e.options[e.selectedIndex].value : undefined;
            e = document.getElementById("repositories_doc");
            var strUser2 = (e) ? e.options[e.selectedIndex].value : undefined;
            var str = {};
            var data = Statsc.find({cod: 3}).fetch();
            if (strUser && strUser2 && Statsc && data && data[0] && data[0].val) {
                data = data[0];
                data = data.val;
                if (strUser2 != 'All') {
                    data = data.filter(function (a) {
                        return a.EP == strUser2;
                    });
                }
                var lsc = {};
                var res = 0;
                for (var i = 0; i < data.length; i++) {
                    var v = 't';
                    var g = undefined;
                    switch (strUser) {
                        case 'type':
                            v = 't';
                            g = 'Document';
                            break;
                        case 'language':
                            v = 'l';
                            break;
                        case 'year':
                            v = 'y';
                            break;
                    }
                    var st = data[i].val;
                    for (var j = 0; j < st.length; j++) {
                        var clas = st[j][v + ''].value;
                        clas = clas.substr(clas.lastIndexOf('/') + 1);
                        clas = clas.substr(clas.lastIndexOf('#') + 1);
                        var cou = Number(st[j].c.value);
                        if (lsc[clas + '']) {
                            lsc[clas + ''] = lsc[clas + ''] + cou;
                        } else {
                            lsc[clas + ''] = cou;
                        }
                        if (g && clas != g) {
                            res += cou;
                        }
                    }
                }
                if (g) {
                    lsc[g + ''] -= res;
                }
                str = [];
                for (var propertyName in lsc) {
                    str.push({value: lsc[propertyName + ''], label: propertyName + ""});
                }
                str.sort(function (a, b) {
                    return (a.label > b.label) ? 1 : 0;
                });
            } else {
                str = [{value: 100, label: "Something"}];
            }
            $('#DocumentsChart').empty();
            try {
                if (strUser == 'year') {
                    var data = str;

                    // Get the data

                    data.forEach(function (d) {
                        d.label = Number(d.label);
                        d.value = Number(d.value);
                    });
                    data = data.filter(function (d) {
                        return d.label > 1850;
                    });
                    var vmin = d3.min(data, function (d) {
                        return d.label;
                    });
                    var since = (vmin < 1850) ? 1850 : vmin;

                    //console.log(data);
                    // Set the dimensions of the canvas / graph
                    var margin = {top: 30, right: 20, bottom: 30, left: 50},
                    width = $('#DocumentsChart').width() - margin.left - margin.right,
                            height = 300 - margin.top - margin.bottom;
// Parse the date / time
                    var parseDate = d3.time.format("%Y").parse;
                    var formatTime = d3.time.format("%Y %B");

// Set the ranges
                    var x = d3.scale.linear().range([0, width]);
                    var y = d3.scale.log().base(10).range([height, 0]);

// Define the axes

                    var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
                            formatPower = function (d) {
                                return (d + "").split("").map(function (c) {
                                    return superscript[c];
                                }).join("");
                            };


                    var xAxis = d3.svg.axis().scale(x)
                            .orient("bottom").ticks(7);

                    var yAxis = d3.svg.axis().scale(y)
                            .orient("left").tickFormat(function (d) {
                        return (d == 1 || d == 10 || d == 100 || d == 1000 || d == 10000 || d == 100000) ? d : '';
                    }).ticks(5);

// Define the line
                    var valueline = d3.svg.line()
                            .x(function (d) {
                                return x(d.label);
                            })
                            .y(function (d) {
                                return y(d.value);
                            });

// Define the div for the tooltip
                    var div = d3.select("body").append("div")
                            .attr("class", "tooltip")
                            .style("opacity", 0);

// Adds the svg canvas
                    var svg = d3.select("#DocumentsChart")
                            .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform",
                                    "translate(" + margin.left + "," + margin.top + ")");


                    var mmax = d3.max(data, function (d) {
                        return d.label;
                    });

                    var __d = new Date();
                    var __n = __d.getFullYear();

                    mmax = (mmax > __n) ? __n + 1 : mmax;
                    // Scale the range of the data
                    x.domain([since, mmax]);
                    /* x.domain([since, d3.max(data, function (d) {
                     return d.label;
                     })]);*/
                    y.domain([1, d3.max(data, function (d) {
                            return d.value;
                        })]);

                    // Add the valueline path.
                    // svg.append("path")
                    //       .attr("class", "line")
                    //     .attr("d", valueline(data));

                    // Add the scatterplot
                    svg.selectAll("dot")
                            .data(data)
                            .enter().append("circle")
                            .attr("r", 2)
                            .attr("cx", function (d) {
                                return x(d.label);
                            })
                            .attr("cy", function (d) {
                                return y(d.value);
                            })
                            .on("mouseover", function (d) {
                                div.transition()
                                        .duration(200)
                                        .style("opacity", .9);
                                div.html(d.label + "<br/>" + "(" + d.value + ")")
                                        .style("left", (d3.event.pageX) + "px")
                                        .style("top", (d3.event.pageY - 28) + "px");
                            })
                            .on("mouseout", function (d) {
                                div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                            });

                    // Add the X Axis
                    svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                    // Add the Y Axis
                    svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis);

                } else
                {
                    if (strUser == 'language' || strUser == 'type') {

                        var max = 3;
                        if (strUser == 'type') {
                            max = 5;
                        }


                        str.sort(function (a, b) {
                            return (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0);
                        });


                        var str2 = [];
                        for (var i = 0; i < str.length; i++) {
                            if (i <= max) {
                                str2.push(str[i]);
                            } else {
                                str2[max].label = 'Others';
                                str2[max].value += str[i].value;
                            }

                        }
                        str = str2;
                    }

                    var pie2 = new d3pie("DocumentsChart", {
                        "header": {
                            "title": {
                                "text": lang.lang("Documents"),
                                "fontSize": 22,
                                "font": "verdana"
                            },
                            "subtitle": {
                                "text": "",
                                "color": "#999999",
                                "fontSize": 10,
                                "font": "verdana"
                            },
                            "titleSubtitlePadding": 12
                        },
                        "footer": {
                            "color": "#999999",
                            "fontSize": 11,
                            "font": "open sans",
                            "location": "bottom-center"
                        },
                        "size": {
                            "canvasHeight": 300,
                            "canvasWidth": $('#DocumentsChart').width(),
                            "pieOuterRadius": "80%"
                        },
                        "data": {
                            "sortOrder": "random",
                            "content": str
                        },
                        "labels": {
                            "outer": {
                                "pieDistance": 5
                            },
                            "inner": {
                                "hideWhenLessThanPercentage": 3
                            },
                            "mainLabel": {
                                "font": "verdana"
                            },
                            "percentage": {
                                "color": "#000000",
                                "font": "verdana",
                                "decimalPlaces": 0
                            },
                            "value": {
                                "color": "#e1e1e1",
                                "font": "verdana"
                            },
                            "lines": {
                                "enabled": true,
                                "style": "straight"
                            },
                            "truncation": {
                                "enabled": true
                            }
                        },
                        "effects": {
                            "pullOutSegmentOnClick": {
                                "effect": "linear",
                                "speed": 400,
                                "size": 8
                            }
                        },
                        "tooltips": {
                            "enabled": true,
                            "type": "placeholder",
                            "string": "{label}: {value}, {percentage}%"
                        },
                        callbacks: {
                            onMouseoverSegment: function (info) {
                                //console.log("mouseover:", info);
                            },
                            onMouseoutSegment: function (info) {
                                // console.log("mouseout:", info);
                            }
                        }
                    });
                }
            } catch (az)
            {
                //console.log(az);
            }
            return str;
        },
        g5: function () {
            Session.get('auxAct');
            var e = document.getElementById("repositories_per");
            var strUser2 = (e) ? e.options[e.selectedIndex].value : undefined;
            var str = {};
            var frequency_list = [];
            var data = Statsc.find({cod: 4}).fetch();
            var data2 = Statsc.find({cod: 5}).fetch();

            if (strUser2 && Statsc && data && data[0] && data[0].val && data2 && data2[0] && data2[0].val) {
                data = data[0];
                data = data.val;
                //Top A
                data2 = data2[0];
                data2 = data2.val;
                //Top A
                if (strUser2 != 'All') {
                    data = data.filter(function (a) {
                        return a.EP == strUser2;
                    });
                    //TopA
                    data2 = data2.filter(function (a) {
                        return a.EP.value == strUser2;
                    });
                    //TopA
                }
                var lsc = {};
                var res = 0;
                var resTot = 0;
                for (var i = 0; i < data.length; i++) {
                    var st = data[i].val.val;
                    var tot = data[i].val.total;
                    resTot += tot;

                    for (var j = 0; j < st.length; j++) {
                        var clas = st[j].p.value;
                        clas = clas.substr(clas.lastIndexOf('/') + 1);
                        clas = clas.substr(clas.lastIndexOf('#') + 1);

                        switch (clas) {
                            case 'P50195':
                                clas = 'Authors';
                                break;
                            case 'P50161':
                                clas = 'Editors';
                                break;
                        }

                        var cou = Number(st[j].c.value);
                        if (lsc[clas + '']) {
                            lsc[clas + ''] = lsc[clas + ''] + cou;
                        } else {
                            lsc[clas + ''] = cou;
                        }
                        res += cou;
                    }
                }
                var inter = res - resTot;
                str = [];
                var inters = '';
                for (var propertyName in lsc) {
                    str.push({value: lsc[propertyName + ''] - inter, label: propertyName + ""});
                    inters = inters + propertyName + ' & ';
                }
                inters = inters.substring(0, inters.length - 3);
                if (inter > 0) {
                    str.push({value: inter, label: inters + ""});
                }
                //TopA
                frequency_list = [];
                var max = 0;
                for (var i = 0; i < data2.length; i++) {
                    frequency_list.push({"text": data2[i].name.value, "size": Number(data2[i].counter.value), "uri": data2[i].a.value});
                    if (max < Number(data2[i].counter.value)) {
                        max = Number(data2[i].counter.value);
                    }
                }
                frequency_list = _.sample(frequency_list, 25);

                for (var q = 0; q < frequency_list.length; q++) {
                    frequency_list[q].size = (frequency_list[q].size / max) * 10 + 10;
                }



                //TopA
            } else {
                str = [{value: 100, label: "Something"}];
                frequency_list = [{"text": "study", "size": 40}, {"text": "motion", "size": 15}];
            }
            $('#PersonsChart').empty();
            try {
                var pie2 = new d3pie("PersonsChart", {
                    "header": {
                        "title": {
                            "text": lang.lang("Persons"),
                            "fontSize": 22,
                            "font": "verdana"
                        },
                        "subtitle": {
                            "text": "",
                            "color": "#999999",
                            "fontSize": 10,
                            "font": "verdana"
                        },
                        "titleSubtitlePadding": 12
                    },
                    "footer": {
                        "color": "#999999",
                        "fontSize": 11,
                        "font": "open sans",
                        "location": "bottom-center"
                    },
                    "size": {
                        "canvasHeight": 300,
                        "canvasWidth": $('#PersonsChart').width(),
                        "pieOuterRadius": "80%"
                    },
                    "data": {
                        "sortOrder": "random",
                        "content": str
                    },
                    "labels": {
                        "outer": {
                            "pieDistance": 5
                        },
                        "inner": {
                            "hideWhenLessThanPercentage": 3
                        },
                        "mainLabel": {
                            "font": "verdana"
                        },
                        "percentage": {
                            "color": "#000000",
                            "font": "verdana",
                            "decimalPlaces": 0
                        },
                        "value": {
                            "color": "#e1e1e1",
                            "font": "verdana"
                        },
                        "lines": {
                            "enabled": true,
                            "style": "straight"
                        },
                        "truncation": {
                            "enabled": true
                        }
                    },
                    "effects": {
                        "pullOutSegmentOnClick": {
                            "effect": "linear",
                            "speed": 400,
                            "size": 8
                        }
                    },
                    "tooltips": {
                        "enabled": true,
                        "type": "placeholder",
                        "string": "{label}: {value}, {percentage}%"
                    },
                    callbacks: {
                        onMouseoverSegment: function (info) {
                            //console.log("mouseover:", info);
                        },
                        onMouseoutSegment: function (info) {
                            // console.log("mouseout:", info);
                        }
                    }
                });


                if ($('#lstags2').length == 0 || $('#myCanvas2').length == 0 || $('#TPersonsChart').length == 0) {
                    return str;
                }

                $('#lstags2').empty();
                var ul = document.getElementById("lstags2");

                for (var i = 0; i < frequency_list.length; i++) {
                    var li = document.createElement("li");
                    var a = document.createElement("a");
                    a.setAttribute("href", frequency_list[i].uri);
                    a.setAttribute("target", '_blank');
                    var txt = document.createTextNode(frequency_list[i].text);
                    a.appendChild(txt);
                    a.setAttribute("data-weight", "" + frequency_list[i].size);
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                TagCanvas.Start('myCanvas2', 'tags2', {
                    textColour: '#000000',
                    outlineColour: '#ff00ff',
                    reverse: true,
                    depth: 1.0,
                    weight: true,
                    weightFrom: 'data-weight',
                    initial: [0.0, -0.05],
                    maxSpeed: 0.05,
                    shadow: '#ccf',
                    shadowBlur: 3
                });
            } catch (az) {
                //console.log(az);
            }
            return str;

        },
        g6: function () {
            Session.get('auxAct');
            var e = document.getElementById("repositories_col");
            var strUser2 = (e) ? e.options[e.selectedIndex].value : undefined;
            var str = [];
            var data = Statsc.find({cod: 6}).fetch();
            if (strUser2 && Statsc && data && data[0] && data[0].val) {
                data = data[0];
                data = data.val;
                if (strUser2 != 'All') {
                    data = data.filter(function (a) {
                        return a.EP.value == strUser2;
                    });
                }
                var max = 10;
                for (var i = 0; i < data.length; i++) {
                    if (i <= max) {
                        str.push({value: Number(data[i].counter.value), label: data[i].name.value});
                    } else {
                        str[max].label = 'Others';
                        str[max].value += Number(data[i].counter.value);
                    }
                }
            } else {
                str = [{value: 100, label: "Something"}];
            }
            $('#CollectionsChart').empty();
            try {

                var pie = new d3pie("CollectionsChart", {
                    "header": {
                        "title": {
                            "text": lang.lang("Collections"),
                            "fontSize": 22,
                            "font": "verdana"
                        },
                        "subtitle": {
                            "text": lang.lang("top-collections"),
                            "color": "#999999",
                            "fontSize": 10,
                            "font": "verdana"
                        },
                        "titleSubtitlePadding": 12
                    },
                    "footer": {
                        "color": "#999999",
                        "fontSize": 11,
                        "font": "open sans",
                        "location": "bottom-center"
                    },
                    "size": {
                        "canvasHeight": 300,
                        "canvasWidth": $('#CollectionsChart').width(),
                        "pieOuterRadius": "80%"
                    },
                    "data": {
                        "sortOrder": "random",
                        "content": str
                    },
                    "labels": {
                        "outer": {
                            "pieDistance": 5
                        },
                        "inner": {
                            "hideWhenLessThanPercentage": 3
                        },
                        "mainLabel": {
                            "font": "verdana"
                        },
                        "percentage": {
                            "color": "#000000",
                            "font": "verdana",
                            "decimalPlaces": 0
                        },
                        "value": {
                            "color": "#e1e1e1",
                            "font": "verdana"
                        },
                        "lines": {
                            "enabled": true,
                            "style": "straight"
                        },
                        "truncation": {
                            "enabled": true
                        }
                    },
                    "effects": {
                        "pullOutSegmentOnClick": {
                            "effect": "linear",
                            "speed": 400,
                            "size": 8
                        }
                    },
                    "tooltips": {
                        "enabled": true,
                        "type": "placeholder",
                        "string": "{label}: {value}, {percentage}%"
                    }
                });
            } catch (az) {
                //console.log(az);
            }



        },
        endpointsAvailable: function () {
            return Endpoints.find({status: 'A'}).fetch();
        }
    });
    // Muestra consultas - JS
    Template.samples.helpers({
        queriesAvailable: function () {
            return Queries.find().fetch();
        },
        settings: function () {
            return {
                //   rowsPerPage: 10,
                rowsPerPage: 7,
                showFilter: true,
                //showNavigation: 'auto',
                //showColumnToggles: true,
                fields:
                        [
                            {
                                key: 'title',
                                label: lang.lang("Title"),
                                fn: function (title, object) {
                                    var html = '<a href="/dashboard/' + object._id + '">' + title + '</a>';
                                    return new Spacebars.SafeString(html);
                                }
                            },
                            {key: 'description', label: lang.lang("Description")}
                        ]
            };
        }
    });
    // JS
    Template.favsearch.helpers({
        histsearch: function () {
            Meteor.subscribe('favresources', function onReady() {
                //Session.set('tasksLoaded', true);
                waitingDialog.hide();
            });
            var s = Searchs.find({idUser: Meteor.userId()}).fetch();
            // waitingDialog.hide ();
            return s;
        },
        settingshist: function () {
            return {
                //   rowsPerPage: 10,
                rowsPerPage: 5,
                showFilter: false,
                //showNavigation: 'auto',
                //showColumnToggles: true,
                fields:
                        [
                            {
                                key: 'searchword',
                                label: lang.lang("Search_action"),
                                headerClass: 'col-md-4',
                                fn: function (searchword, object) {
                                    var html = '<a  href="/search/' + searchword + '/' + object.searchfilters + '/UCUE">' + searchword + '</a>';
                                    return new Spacebars.SafeString(html);
                                }

                            },
                            {
                                key: 'searchfilters',
                                label: lang.lang("Filters"),
                            },
                            {key: 'sources',
                                label: lang.lang("Sources"),
                                fn: function (sources, object) {
                                    var listsources = "";
                                    _.each(object.sources, function (el, idx) {

                                        listsources = el.Name + ', ' + listsources;

                                    });
                                    //console.log (object);
                                    //object.sources
                                    // console.log (sources);
                                    return listsources;
                                }

                            }, {key: 'timeaction',
                                label: lang.lang("Date"), headerClass: 'col-md-3',
                                sortOrder: 0,
                                sortDirection: 'descending',
                                sortByValue: true,
                                fn: function (timeact, object) {
                                    console.log(object.timeaction);
                                    var d = new Date(object.timeaction);
                                    return    d.toLocaleString();
                                }

                            }, {
                                key: '_id',
                                label: lang.lang("delete"),
                                fn: function (value, object) {
                                    return new Spacebars.SafeString("<td> <button type='button' class='btn btn-default' id='deleteUserbutton' onClick='deletehist(this)' Idsearch=" + value + "  ><span class='glyphicon glyphicon-remove'></span></button></td>");
                                }

                            }
                        ]
            };
        }
        ,
        favres: function () {
            return   Favresources.find({idUser: Meteor.userId()}).fetch();
        }, settingsfav: function () {
            return {
                rowsPerPage: 5,
                showFilter: false,
                //showNavigation: 'auto',
                //showColumnToggles: true,
                fields:
                        [
                            {key: 'urifav',
                                label: lang.lang("Resource"),
                                fn: function (urifav, object) {
                                    var html = '<a target="_blank" href="' + urifav + '">' + urifav + '</a>';
                                    return new Spacebars.SafeString(html);
                                }


                            }, {
                                key: 'labelres',
                                label: lang.lang("Name"),
                                headerClass: 'col-md-6'


                            },
                            {
                                key: 'timeaction',
                                label: lang.lang("Date"),
                                sortOrder: 0,
                                sortDirection: 'descending',
                                sortByValue: true,
                                fn: function (timeact, object) {
                                    console.log(object.timeaction);
                                    var d = new Date(object.timeaction);
                                    return    d.toLocaleString();
                                }



                            },
                            {
                                key: '_id',
                                label: lang.lang("delete"),
                                fn: function (value, object) {
                                    return new Spacebars.SafeString("<td> <button type='button' class='btn btn-default' id='deleteUserbutton' onClick='deletefav(this)' Idres=" + value + "  ><span class='glyphicon glyphicon-remove'></span></button></td>");
                                }

                            }

                        ]


            }
        }
    });

    Template.adminpanel.helpers({
        usersAvailable: function () {

            return Profile.find().fetch();
        },
        settings: function () {
            return {
                //   rowsPerPage: 10,
                rowsPerPage: 10,
                showFilter: true,
                //showNavigation: 'auto',
                //showColumnToggles: true,
                fields:
                        [
                            {
                                key: 'nameUser',
                                label: lang.lang("Names")
                            },
                            {key: 'accessLevel',
                                label: lang.lang("User"),
                                fn: function (value, object) {

                                    var check;
                                    // alert (countrow);
                                    if (value == 0)
                                    {
                                        check = 'checked';
                                    } else {
                                        check = '';
                                    }
                                    //$(this).attr('checked','checked');
                                    // return new Spacebars.SafeString("<input checked="+check+" type='checkbox' />"); }
                                    return new Spacebars.SafeString("<input value=" + 0 + " name=user" + object.idProfile + " " + check + " type='radio' onClick='ChangeAccess(this)' />");
                                }
                            },
                            {key: 'accessLevel',
                                label: lang.lang("Advanced_User"),
                                fn: function (value, object) {
                                    var check;


                                    if (value == 1)
                                    {
                                        check = 'checked';
                                    } else {
                                        check = '';
                                    }
                                    //$(this).attr('checked','checked');
                                    // return new Spacebars.SafeString("<input checked="+check+" type='checkbox' />"); }
                                    //return new Spacebars.SafeString("<input name=user"+object.idProfile+" checked="+check+" type='radio' />"); }
                                    return new Spacebars.SafeString("<input value=" + 1 + " name=user" + object.idProfile + " " + check + "  type='radio' onClick='ChangeAccess(this)' />");
                                }
                            }, {key: 'accessLevel',
                                label: lang.lang("Admin"),
                                fn: function (value, object) {
                                    var check;
                                    //  alert (object);
                                    if (value == 2)
                                    {
                                        check = 'checked';
                                    } else {
                                        check = '';
                                    }
                                    //$(this).attr('checked','checked');
                                    // return new Spacebars.SafeString("<input checked="+check+" type='checkbox' />"); }
                                    return new Spacebars.SafeString("<input value=" + 2 + " name=user" + object.idProfile + " " + check + " type='radio'  onClick='ChangeAccess(this)' />");
                                }
                            },
                            {key: 'levelAcademic',
                                label: lang.lang("Occupation"),
                                fn: function (value, object) {
                                    var text;
                                    if (value == 0)
                                    {
                                        text = "Estudiante";
                                    } else if (value == 1) {
                                        text = "Profesor";
                                    } else if (value == 2) {
                                        text = "Investigador";
                                    } else {

                                        text = "Otros";
                                    }

                                    return new Spacebars.SafeString("<p>" + text + "</p>");
                                }
                            },
                            {key: 'secMail',
                                label: lang.lang("Email")
                            },
                            {
                                key: 'idProfile',
                                label: lang.lang("delete"),
                                fn: function (value, object) {
                                    return new Spacebars.SafeString("<td> <button type='button' class='btn btn-default' id='deleteUserbutton' onClick='deleteUser(this)' userId=" + value + "  ><span class='glyphicon glyphicon-remove'></span></button></td>");
                                }

                            }
                        ]
            };
        }
    });


//JO
//zero padding function
    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
//JO*

    Template.profile.helpers({
        IntAreas: function () {

            var inta = [];
            for (var i = 0; i < 19; i++) {
                inta.push({lbl: lang.lang("FoS_" + i), pos: i});
            }
            return inta;
        }
    });


    Template.dashboard.helpers({
        endpointsAvailable: function () {
            return Endpoints.find({status: 'A'}).fetch();
        },
        listEndpointsAvailable: function () {
            return Endpoints.find({status: 'A'}, {sort: {base: -1}}).fetch();
        },
        resultQuery: function () {
            var response = App.resultCollection.findOne();
            var resp = response ? JSON.parse(response.content).results.bindings : [];
            for (var x = 0; x < resp.length; x++) {
                resp[x].num = x + 1;
            }
            return resp;
        },
        settings: function () {
            var response = App.resultCollection.findOne();
            if (response) {
                var prefixService = Prefixes.find().fetch();
                var endpoints = Endpoints.find().fetch();
                var fields = JSON.parse(response.content).head.vars;
                var dataField = [];
//JO
//Adding row number column
                var item = {};
                item.key = "cont.value";
                item.label = "#";
                item.fn = function (data, object) {
                    var html = '<p> ' + pad(object.num, 4) + '</p>';
                    return new Spacebars.SafeString(html);
                };
                item.sortOrder = 0;
                dataField.push(item);
//JO*
                _.forEach(fields, function (field) {
                    var item = {};
                    item.key = field + ".value";
                    item.label = field;
                    item.fn = function (data, object) {
                        var typeObject = object[field].type;
                        if (typeObject == 'uri') {
                            var prefix = _.find(prefixService, function (obj) {
                                return object[field].value.indexOf(obj.URI) == 0
                            });
                            var showValue;
                            if (!prefix) { //find endpoint name as prefix
                                var endpoint = _.find(endpoints, function (obj) {
                                    return object[field].value.indexOf(obj.graphURI) == 0
                                });
                                showValue = endpoint ? (endpoint.name + ':' + object[field].value.substring(endpoint.graphURI.length)) : object[field].value;
                            } else {
                                showValue = prefix.prefix + ':' + object[field].value.substring(prefix.URI.length);
                            }
                            //var showValue = prefix ? (prefix.prefix+':'+object.value.substring(prefix.URI.length)):object.value;
                            var html = '<a href="' + object[field].value + '">' + showValue + '</a>';
                        } else {
                            var html = '<p> ' + object[field].value + '</p>';
                        }
                        return new Spacebars.SafeString(html);
                    };
                    dataField.push(item);
                });

                return {
                    rowsPerPage: 5,
                    showFilter: true,
                    showNavigation: 'auto',
                    showColumnToggles: true,
                    fields: dataField,
                };
            }
        }
    });

    Template.endpoint.helpers({
        endpointEntity: function () {
            //var entities = Properties.find({},{fields: {'subjects': 1, _id: 1}}).fetch();
            var endpoints = Session.get('endpoints');
            var response = [];

            response.status = 'EMPTY';
            if (endpoints && endpoints.length > 0) {
                console.log('==Si existen edpoints');
                response.status = 'OK';
                endpoints.forEach(function (obj) {
                    console.log(obj.endpoint);
                    console.log(obj);
                    var graph = {};
                    graph.name = obj.name
                    graph.colorid = obj.colorid;
                    graph.endpoint = obj.endpoint;
                    graph.graphURI = obj.graphURI;
                    graph.description = obj.description;
                    var entities = Properties.find({endpoint: obj.endpoint,
                        graphURI: obj.graphURI}
                    ).fetch();


                    entities = jQuery.grep(entities, function (n) {
                        return n !== undefined;
                    });
                    console.log('Properties');
                    console.log(entities);


                    var properties = [];



                    properties = entities;

                    entities = _.pluck(entities, 'subjects');
                    //   console.log ("Pluck");
                    //   console.log (entities);
                    //console.log('==encontrados: ' + entities.length);
                    var values = [];
                    for (var i = 0; i < entities.length; i++) {
                        values = _.union(values, entities[i]);
                        //console.log (entities[i][0]);
                    }

                    graph.endpointEntities = _.uniq(values, false, function (obj) {
                        return obj.fullName;
                    });
                    graph.endpointProperties = properties;
                    /*      if (graph.endpointProperties [0]  === undefined)
                     {
                     console.log ('Vacio');

                     }else {
                     console.log ('No Vacio');
                     console.log (graph.endpointProperties[0]);
                     console.log (graph.endpointProperties[1]);
                     }
                     */
                    var hash = {};

                    for (var j = 0; j < graph.endpointProperties.length; j++) {

                        var entidadesrel = _.pluck(graph.endpointProperties[j].subjects, "name");
                        var entidadestext = "";

                        for (var h = 0; h < entidadesrel.length; h++) {
                            entidadestext = entidadesrel[h];
                            if (hash.hasOwnProperty(entidadestext)) {
                                hash[entidadestext] = hash[entidadestext] + " " + graph.endpointProperties[j].name;
                            } else {
                                hash[entidadestext] = graph.endpointProperties[j].name;

                            }
                        }
                        //   console.log ("Rel");
                        //   console.log (entidadesrel);
                        //  graph.endpointProperties[j].enti = entidadestext ;
                        var name = graph.endpointProperties[j].name;
                        if (name.length > 10) {
                            graph.endpointProperties[j].dim = "col-xs-10 col-sm-8 col-md-6";
                        } else {
                            graph.endpointProperties[j].dim = "col-xs-6 col-sm-4 col-md-3";
                        }
                        if (j % 3 == 0 && j > 0 && name.length > 10) {
                            var aux = graph.endpointProperties[j - 1];
                            graph.endpointProperties[j - 1] = graph.endpointProperties[j];
                            graph.endpointProperties[j] = aux;
                        }
                        console.log("Prop");
                        console.log(graph.endpointProperties[j]);

                    }
                    console.log("HASH ");
                    console.log(hash);


                    for (j = 0; j < graph.endpointEntities.length; j++) {

                        // Ajusta el tamanio div segun el texto
                        var name = graph.endpointEntities[j].name;
                        graph.endpointEntities[j].ent = hash[name];
                        if (name.length > 10) {
                            graph.endpointEntities[j].dim = "col-xs-10 col-sm-8 col-md-6";
                        } else {
                            graph.endpointEntities[j].dim = "col-xs-6 col-sm-4 col-md-3";
                        }
                        // Para evitar que se coloque en el ultimo lugar de la fila cuando ocupa dos cuadros
                        if (j % 3 == 0 && name.length > 10) {
                            var aux = graph.endpointEntities[j - 1];
                            graph.endpointEntities[j - 1] = graph.endpointEntities[j];
                            graph.endpointEntities[j] = aux;
                        }
                        //  console.log ("Ent");
                        // console.log (graph.endpointEntities[j]);

                    }

                    Session.set(graph.endpoint + '|' + graph.graphURI, {entities: graph.endpointEntities, properties: graph.endpointProperties});
                    response.push(graph);
                    //console.log(graph);
                });

                /*var entities = Properties.find( {endpoint: {$in :_.pluck(endpoints, 'endpoint')},
                 graphURI: {$in: _.pluck(endpoints, 'graphURI')}},
                 {sort: {endpoint: -1, graphURI: -1}}).fetch();
                 entities = _.pluck(entities, 'subjects');
                 var values = [];
                 for(var i=0; i<entities.length; i++) {
                 values = _.union(values, entities[i]);
                 }
                 response.status = 'OK';
                 response.endpointEntities = _.uniq(values, false, function(obj){return obj.fullName;});
                 response.endpointProperties = entities;
                 Session.set('entities', entities);*/
                //Session.set('graphs', response);
            }
            //console.log(response);
            return response;
            //return _.uniq(values, false, function(obj){return obj.fullName;});
        }/*,

         endpointProperty: function(){
         Session.set('properties', Properties.find().fetch());
         console.log('#### : ' + Properties.find().fetch().length);
         return Properties.find();
         }*/
    });

    Template.hello.greeting = function () {
        return "Hello from sparqlfedquery";
    }

    Template.hello.helpers({
        counter: function () {
            return Session.get("counter");
        }
    });
//*


    Template.graph.helpers({
        Numresultgraph: function () {
            return Session.get("numresultgraph");
        }
    });

    Session.set('auxAct', 0);

    /*
     Template.header.helpers({
     access_level: function() {
     // if  (Meteor.user().profile[1].access > 1) {
     //  var obj = Meteor.user().profile;
     // var valaccess =  obj[Object.keys(obj)[0]];
     console.log ("Usuario segundo");
     // var usr = Meteor.users.find(Meteor.userId()).fetch();
     var usr =  Meteor.users.find(Meteor.userId()).fetch()[0].profile[1].access;
     console.log (usr);
     return true;
     //  } else {
     //       return false;
     //  }


     }
     });*/

    this.facetedRange = (function () {

        try {
            var ss = $("#slider-range")[0].attributes['data-inf'].value;
        } catch (s) {
            return 0;
        }


        var mm = Number($("#slider-range")[0].attributes['data-min'].value);
        var mx = Number($("#slider-range")[0].attributes['data-max'].value);
        var mm_ = Number($("#slider-range")[0].attributes['data-min'].value);
        var mx_ = Number($("#slider-range")[0].attributes['data-max'].value);



        console.log(mm);
        console.log(mx);
        console.log(mm_);
        console.log(mx_);
        try {
            mm_ = $("#slider-range").slider("values", 0)
            mx_ = $("#slider-range").slider("values", 1)
        } catch (e) {
        }
        var d = JSON.parse($("#slider-range")[0].attributes['data-inf'].value);

        $("#slider-range").empty();
        Array.prototype.sum = function (prop) {
            var total = 0
            for (var i = 0, _len = this.length; i < _len; i++) {
                total += this[i][prop]
            }
            return total
        }

        var data = d;
        $("#slider-range").slider({
            range: true,
            min: mm,
            max: mx,
            values: [mm_, mx_],
            slide: function (event, ui) {
                var n = data.filter(function (d) {
                    return d.key == null || d.key >= ui.values[ 0 ] && d.key <= ui.values[ 1 ];
                }).sum("count");
                $("#amount").val("" + ui.values[ 0 ] + " - " + ui.values[ 1 ] + " (" + n + ")");
            }
        });
        var n = data.filter(function (d) {
            return d.key == null || d.key >= $("#slider-range").slider("values", 0) && d.key <= $("#slider-range").slider("values", 1);
        }).sum("count");
        $("#amount").val("" + $("#slider-range").slider("values", 0) +
                " - " + $("#slider-range").slider("values", 1) + " (" + n + ")");


        return 0;
    });

    Template.nlsearch.helpers({
        Loading: function () {
            return Session.get('AuxCargS')>0;
        },
        endpointsAvailable: function () {
            return Endpoints.find({status: 'A'}).fetch();
        },
        resultQuery: function () {
            var response = App.resultCollectionSL.findOne();
            var resp = response ? JSON.parse(response.content).results.bindings : [];
            for (var x = 0; x < resp.length; x++) {
                resp[x].num = x + 1;
            }
            return resp;
        },
        resultQueryN: function () {
            var response = App.resultCollectionSL.findOne();
            return response != undefined && response != null;
        },
        settings: function () {
            var response = App.resultCollectionSL.findOne();
            if (response) {
                var prefixService = Prefixes.find().fetch();
                var endpoints = Endpoints.find().fetch();
                var fields = JSON.parse(response.content).head.vars;
                var dataField = [];
//JO
//Adding row number column
                var item = {};
                item.key = "cont.value";
                item.label = "#";
                item.fn = function (data, object) {
                    var html = '<p> ' + pad(object.num, 4) + '</p>';
                    return new Spacebars.SafeString(html);
                };
                item.sortOrder = 0;
                //dataField.push(item);
//JO*
                _.forEach(fields, function (field) {
                    var item = {};
                    item.key = field + ".value";
                    item.label = field;
                    item.fn = function (data, object) {
                        var typeObject = object[field].type;
                        if (typeObject == 'uri') {
                            var prefix = _.find(prefixService, function (obj) {
                                return object[field].value.indexOf(obj.URI) == 0
                            });
                            var showValue;
                            if (!prefix) { //find endpoint name as prefix
                                var endpoint = _.find(endpoints, function (obj) {
                                    return object[field].value.indexOf(obj.graphURI) == 0
                                });
                                showValue = endpoint ? (endpoint.name + ':' + object[field].value.substring(endpoint.graphURI.length)) : object[field].value;
                            } else {
                                showValue = prefix.prefix + ':' + object[field].value.substring(prefix.URI.length);
                            }
                            //var showValue = prefix ? (prefix.prefix+':'+object.value.substring(prefix.URI.length)):object.value;
                            var html = '<a target="_blank" href="' + object[field].value + '">' + showValue + '</a>';
                        } else {
                            var html = '<p> ' + object[field].value + '</p>';
                        }
                        return new Spacebars.SafeString(html);
                    };
                    dataField.push(item);
                });

                return {
                    rowsPerPage: 5,
                    showFilter: false,
                    showNavigation: 'auto',
                    showColumnToggles: false,
                    fields: dataField,
                };
            }
        }
    });

    Template.welcomePage.helpers({
        recoavailable: function () {
            var presentar;
            var Recomend2 = Recomendation.find({'userid': Meteor.userId(), 'type': '2'}).fetch();
            var Recomend1 = Recomendation.find({'type': '1', 'userid': Meteor.userId()}, {$sort: {"score": -1}, limit: 20}).fetch();
            // presentar = Recomend2 ;
            presentar = Recomend2.concat(Recomend1);
            var selecc = [];
            var i;
            var ranum = [];
            if (presentar.length > 4) {
                console.log(presentar);
                for (i = 0; i < 5; i++) {
                    var rand;
                    do {
                        rand = Math.round(Math.random() * (presentar.length - 1));
                        console.log(_.contains(ranum, rand));

                    } while (_.contains(ranum, rand));
                    ranum.push(rand);
                    console.log("Dim" + presentar.length);
                    console.log("ran" + rand);
                    console.log(presentar [rand]);

                    var classoftype = presentar[rand].typeofclass;

                    if (classoftype.includes("Person")) {
                        presentar[rand].icon = "images/authorcol.png";
                        presentar[rand].sizeicon = "25 px;";
                    } else if (classoftype.includes("Collection")) {
                        presentar[rand].icon = "images/collection.png";
                        presentar[rand].sizeicon = "25 px;";
                    } else {

                        presentar[rand].icon = "images/documento.png";
                        presentar[rand].sizeicon = "12 px;";
                    }
                    selecc[i] = presentar[rand];
                    console.log(presentar[rand].typeofclass);

                }
                // presentar[Math.round(Math.random ()*presentar.length())];
            }
            // selecc = presentar;
            // db.recomendation.find({'type':'2', "userid" : "P3u8C9GM6NS6jYuJ4"}).sort({"score":-1}).limit (5)
            return selecc;
            // return Recomendation.find({ 'userid': Meteor.userId() }).fetch();

        }
    });

    Template.search.helpers({
        facetedOptions: function () {
            //$("#fac").empty();
            var n = Session.get("facetedTotals");
            //console.log(n);
            var nn = Session.get("facetedTotalsN");
            if (n == null || n == null && nn == null) {
                return [];
            }
            if (nn != undefined && nn != null) {
                n.Years = n.Years.map(function (d) {
                    var r = nn.Years.filter(function (q) {
                        return q.key == d.key;
                    });
                    if (r.length > 0) {
                        d.count = r[0].count;
                    } else {
                        d.count = 0;
                    }
                    return d;
                });
                n.Types = n.Types.map(function (d) {
                    var r = nn.Types.filter(function (q) {
                        return q.key == d.key;
                    });
                    if (r.length > 0) {
                        d.count = r[0].count;
                    } else {
                        d.count = 0;
                    }
                    return d;
                });
                n.Langs = n.Langs.map(function (d) {
                    var r = nn.Langs.filter(function (q) {
                        return q.key == d.key;
                    });
                    if (r.length > 0) {
                        d.count = r[0].count;
                    } else {
                        d.count = 0;
                    }
                    return d;
                });
                n.Endpoints = n.Endpoints.map(function (d) {
                    var r = nn.Endpoints.filter(function (q) {
                        return q.key == d.key;
                    });
                    if (r.length > 0) {
                        d.count = r[0].count;
                    } else {
                        d.count = 0;
                    }
                    return d;
                });
            }
            n.Years2 = n.Years.filter(function (d) {
                return d.key != null;
            });
            n.Types = n.Types.map(function (d) {
                d.key2 = d.key;
                if (d.key == null) {
                    d.key2 = 'None';
                    return d;
                }
                d.key2 = d.key.substr(d.key.lastIndexOf('/') + 1);
                d.key2 = d.key2.substr(d.key2.lastIndexOf('#') + 1);
                return d;
            });
            n.Langs = n.Langs.map(function (d) {
                d.key2 = d.key;
                if (d.key == null) {
                    d.key2 = 'None';
                }
                ;
                return d;
            });
            n.Endpoints = n.Endpoints.map(function (d) {
                d.key2 = d.key;
                if (d.key == null) {
                    d.key2 = 'None';
                }
                ;
                return d;
            });

            n.Types = n.Types.map(function (d) {
                d.Title = 'Types';
                return d;
            });
            n.Langs = n.Langs.map(function (d) {
                d.Title = 'Langs';
                return d;
            });
            n.Endpoints = n.Endpoints.map(function (d) {
                d.Title = 'Endpoints';
                return d;
            });


            var bbl = (n.Langs.length > 0);



            var facetes = [{Title: lang.lang('lblYears'), Range: true, Values: n.Years, Values2: JSON.stringify(n.Years), Exists: n.Years2.length > 0, Min: n.Years2.length > 0 ? n.Years2[0].key : 0, Max: n.Years2.length > 0 ? n.Years2[n.Years2.length - 1].key : 0},
                {Title: lang.lang('lblTypes'), Range: false, Exists: n.Types.length > 0, Values: n.Types},
                {Title: lang.lang('lblLanguages'), Range: false, Exists: bbl, Values: n.Langs},
                {Title: lang.lang('lblEndpoints'), Range: false, Exists: n.Endpoints.length > 0, Values: n.Endpoints}];



            return facetes;
        },
        endpointsAvailable: function () {
            return Endpoints.find({status: 'A'}).fetch();
        },
        resultFullQuery: function () {
            var response = App.resultCollection2.findOne();
            var rlist = dataSourceSearch(response);
            return rlist;
        },
        BresultFullQuery: function () {
            var n = Session.get("BResult");
            return (n != undefined && n == true);
        }
        ,
        NresultFullQuery: function () {
            var n = Session.get("NResult");
            if (n && n > 0) {
                return n + lang.lang('results');
            } else {
                return  lang.lang('No-results');
            }
        }, DespSug: function () {
            var des = Session.get("DespSug");
            if (des) {

                return "glyphicon glyphicon-chevron-up";
            } else {
                return "glyphicon glyphicon-chevron-down";
            }

        }, DespFac: function () {
            var des = Session.get("DespFac");
            if (des) {

                return "glyphicon glyphicon-chevron-up";
            } else {
                return "glyphicon glyphicon-chevron-down";
            }

        },
        suggestedQueries: function () {

            var EntitySearch = get_radio_value("opciones");
            var w = [];
            //    alert ("Adiios");
            var des = Session.get("DespSug");
            //  if (des){
            switch (EntitySearch) {
                case 'autores':
                    w = loadQueryFirstNode('http://xmlns.com/foaf/0.1/Person');

                    //  Session.set('DespSug', true);
                    break;
                case 'documentos':
                    w = loadQueryFirstNode('http://purl.org/ontology/bibo/Document');

                    // Session.set('DespSug', true);
                    break;
                case 'colecciones':
                    w = loadQueryFirstNode('http://purl.org/ontology/bibo/Collection');

                    //  Session.set('DespSug', true);
                    break;
                default :
                    //  w = Queries.find().fetch();
                    //  $(".sugestion-panel").css ("min-height", "400px");
                    //$("#sug").collapse('show');
                    //  Session.set('DespSug', false);
                    break;
            }
            var aux = Session.get("auxAct");
            var TextSearch = $(".textToSearch").val();
            for (var q = 0; q < w.length; q++) {
                if (TextSearch.trim() != "") {
                    w[q].description = w[q].description.replace("?", TextSearch);
                }
            }
            w = w.filter(function (el) {
                return el.commend == true;
            });
            //  }  // Final If
            return w;
        },
        paginationSettings: function () {
            var n = Session.get("NResult");
            n = n ? n : 0;
            if (n == 0) {
                //n = 1;
                $(".pagination").css("display", "none");
                //  $(".pagination").css("display", "none");
            } else {
                $(".pagination").css("display", "block");
            }
            var pagcon = {};
            pagcon.total = Math.ceil(n / 10);
            $('#page-selection').bootpag({
                total: pagcon.total,
                page: 1,
                maxVisible: 10
            }).on("page", function (event, num) {
                if (num != pa) {
                    pa = num;
                    App.SearchRun(num - 1, -1);
                }
            });
            return pagcon;
        }
    });

    function get_radio_value(RadioName) {
        var inputs = document.getElementsByName(RadioName);
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                return inputs[i].value;
            }
        }
    }
    function loadQueryFirstNode(element) {
        result = {};
        result.statusCode = 200;
        result.msg = 'OK';
        var querylist = [];
        try {

            var query = Queries.find().fetch();
            console.log('Querys server0');
            for (var i = 0; i < query.length; i++)
            {
                console.log('Querys server');
                //  console.log (query[i].jsonGraph.cells.0.subject);
                var js = JSON.parse(query[i]['jsonGraph']);
                var ClassV = js.cells[0].subject;

                try {
                    var spq = query[i].sparql;
                    //var resp = spq.match(new RegExp("REGEX\\((.*),","g"))[0];
                    var resp = spq.match(new RegExp("REGEX\\((.*),", "g"));  //[0]
                    var respp = 0;
                    if (resp && resp.length > 0) {
                        resp = resp[0];
                        respp = 1;
                    } else {
                        respp = 2;
                        resp = spq.match(new RegExp("\\((.*)\\)(.*)\\((.*)\\)", "g"))[0];
                    }
                    var SearchVar = '';
                    var MainVar = '';
                    if (respp == 1) {
                        SearchVar = resp.split('(')[1].split(',')[0];
                        MainVar = spq.match(new RegExp("(.*)\?" + SearchVar + " \.", "g"))[0].split(' ')[0].replace('?', '').split('_')[0];
                    } else {
                        MainVar = resp.split(' ?Score ')[0].split('(')[1].replace('?', '').split('_')[0];
                        //MainVar = spq.match(new RegExp("(.*)\?"+SearchVar+" \.","g"))[0].split(' ')[0].replace('?','').split('_')[0];
                    }

                    //ClassV = js;
                    ClassV = this.Properties.findOne({name: MainVar}).objectTypes[0].objectEntity.fullName;




                } catch (q) {

                }
                // var s  =  js.subject;
                console.log(js);




                if (ClassV == element && element == 'http://xmlns.com/foaf/0.1/Person' || ClassV == element && element == 'http://purl.org/ontology/bibo/Collection' || element == 'http://purl.org/ontology/bibo/Document' && ClassV != 'http://xmlns.com/foaf/0.1/Person' && ClassV != 'http://purl.org/ontology/bibo/Collection')

                {
                    console.log('Querys server');
                    // console.log (query[i].jsonGraph.cells[0].subject);
                    querylist.push(query[i]);
                }
            }
            return querylist;
        } catch (e) {
            console.log(e);
            result.statusCode = 500;
            result.msg = e
        }
        return querylist;
    }
    function dataSourceSearch(response) {
        var toShow = [];
        if (response) {
            //var NumMode = Session.get('Qmode');


            console.log(response.content);

            var NumMode = Qmode;
            //alert(NumMode + "");
            if (NumMode == 2) {
                var SearchVar = Session.get('SearchVar').replace(/\?/g, '');
                var MainVar = Session.get('MainVar').replace(/\?/g, '');
                var TypeVar = Session.get('TypeVar').replace(/\?/g, '');
                var TitleVar = Session.get('TitleVar').replace(/\?/g, '');
                var SearchVar_ = Session.get('SearchVar').replace(/\?/g, '').split('_')[0];
            }
            var resp = response ? JSON.parse(response.content).results.bindings : [];
            var MaxLength = 160;
            var titledoc = "";
            //graphURI
            for (var k = 0; k < resp.length; k++) {
                console.log("Respuesta" + k);
                console.log(resp[k]);
                var OneResult = {};
                if (NumMode == 1) {
                    OneResult = toShow.filter(function (val) {
                        return val.URI === resp[k].EntityURI.value;
                    });
                }
                if (NumMode == 2) {
                    OneResult = toShow.filter(function (val) {
                        return val.URI === resp[k][MainVar].value;
                    });
                }


                if (OneResult.length == 0) {
                    //New

                    var OneResult = {};
                    OneResult.Weight = 1;
                    if (NumMode == 1) {
                        OneResult.Type = resp[k].EntityClass.value;
                        //    titledoc =  resp[k].EntityLabel.value;
                    }
                    if (NumMode == 2) {
                        OneResult.Type = resp[k][TypeVar].value;
                        //  titledoc =  resp[k][TitleVar].value;
                    }

                    var Org = {};



                    if (NumMode == 1) {
                        Org = resp[k].Endpoint.value;
                    }
                    if (NumMode == 2) {
                        Org = resp[k]['Endpoint'].value;
                    }

                    //EndpointsLs.filter(function (val) {return strStartsWith(resp[k].EntityURI.value,val.graphURI); });
                    //var Org = App.FindRepository(resp[k].EntityURI.value);
                    //if (!_.isEmpty(Org)){
                    //Org=Org.name;
                    //}else{
                    // Org='';
                    //}

                    OneResult.Origin = Org;

                    if (NumMode == 1) {
                        OneResult.Label = resp[k].EntityLabel.value;
                        OneResult.URI = resp[k].EntityURI.value;
                        OneResult.MatchsProperty = [{p: resp[k].PropertyLabel.value, v: resp[k].PropertyValue.value, l: resp[k].PropertyValue.value.length > MaxLength, s: resp[k].PropertyValue.value.substr(0, MaxLength), c: resp[k].PropertyValue.value.substr(MaxLength)}];
                    }

                    if (NumMode == 2) {
                        OneResult.Label = resp[k][TitleVar].value;
                        OneResult.URI = resp[k][MainVar].value;
                        OneResult.MatchsProperty = [{p: SearchVar_, v: resp[k][SearchVar].value, l: resp[k][SearchVar].value.length > MaxLength, s: resp[k][SearchVar].value.substr(0, MaxLength), c: resp[k][SearchVar].value.substr(MaxLength)}];
                    }


                    switch (OneResult.Type) {
                        case 'http://xmlns.com/foaf/0.1/Person':
                            OneResult.Icon = 'glyphicon glyphicon-user';
                            OneResult.Image='/buscador/images/personIcon.png'
                            break;
                        case 'http://purl.org/ontology/bibo/Collection':
                            OneResult.Icon = 'glyphicon glyphicon-folder-open';
                            OneResult.Image='/buscador/images/CollectionIcon.png'

                            break;
                        default :
                            OneResult.Icon = 'glyphicon glyphicon-file';
                            OneResult.Image='/buscador/images/documentIcon.png'

                            break;
                    }

                    //Name of author
                    try {
                      OneResult.nameCreator = resp[k].name.value;

                    } catch (e) {

                    } finally {

                    }



                    //Asign name of source
                    try {
                      if(resp[k].organization_des!=undefined){

                        OneResult.Source= resp[k].organization_des.value;
                      }else{
                        OneResult.Source='U-Cuenca';
                      }

                      if(OneResult.Image!= undefined){
                        OneResult.Image = resp[k].Image.value;
                      }

                    } catch (e) {

                    } finally {

                    }



                    var Resourcesfav = Favresources.find({idUser: Meteor.userId()}).fetch();

                    var favorite = Resourcesfav.find(function (val) {
                        return  val.urifav == OneResult.URI;
                    });
                    if (favorite) {

                        OneResult.Fav = "/buscador/images/starblue.png";

                    } else {

                        OneResult.Fav = "/buscador/images/stargray.png";

                    }


                    // OneResult.Fav = '/images/stargray.png';

                    toShow.push(OneResult);
                } else {
                    //Add
                    //

                    //Título largo



                    //
                    // console.log (OneResult);
                    console.log("Resultado 1");
                    console.log(OneResult);

                    OneResult = OneResult[0];

                    if (NumMode == 1) {
                        OneResult.Label = (OneResult.Label.length < resp[k].EntityLabel.value.length) ? resp[k].EntityLabel.value : OneResult.Label;
                    }

                    if (NumMode == 2) {
                        OneResult.Label = (OneResult.Label.length < resp[k][TitleVar].value.length) ? resp[k][TitleVar].value : OneResult.Label;
                    }

                    OneResult.Weight += 1;
                    if (NumMode == 1) {
                        var ln = OneResult.MatchsProperty.filter(function (e) {
                            return e.p == resp[k].PropertyLabel.value && e.v == resp[k].PropertyValue.value;
                        }).length;

                        if (OneResult.Label != resp[k].EntityLabel.value)
                        {
                            ln = 1;
                            // console.log (resp[k].EntityLabel.value);
                            //console.log (resp[k].PropertyLabel.value +" + "+ resp[k].PropertyValue.value );
                        }
                        if (ln == 0) {
                            console.log("Agrupar Normal");

                            var actual = OneResult.MatchsProperty.find(function (val) {
                                return val["p"] == resp[k].PropertyLabel.value;
                            });
                            console.log(actual);
                            console.log(resp[k].PropertyLabel.value);
                            // console.log (OneResult.MatchsProperty[resp[k].PropertyLabel.value]);
                            if (actual == undefined) {
                                console.log("No Agrupa");
                                //console.log (resp[k].PropertyLabel.value);
                                OneResult.MatchsProperty.push({p: resp[k].PropertyLabel.value, v: resp[k].PropertyValue.value, l: resp[k].PropertyValue.value.length > MaxLength, s: resp[k].PropertyValue.value.substr(0, MaxLength), c: resp[k].PropertyValue.value.substr(MaxLength)});

                            } else {

                                console.log("Agrupa");
                                var separador = '';
                                if (resp[k].PropertyLabel.value == "Subject") {

                                    separador = " , ";
                                } else {
                                    separador = "<br>";
                                }
                                var concatval = actual ["v"] + separador + resp[k].PropertyValue.value;
                                console.log(concatval);
                                var valor = OneResult.MatchsProperty.indexOf(actual);
                                console.log(valor);
                                OneResult.MatchsProperty[valor] = {p: resp[k].PropertyLabel.value, v: concatval, l: concatval.length > MaxLength, s: concatval.substr(0, MaxLength), c: concatval.substr(MaxLength)};

                            }
                        }
                    }
                    if (NumMode == 2) {
                        console.log("One sug");
                        console.log(OneResult);

                        var ln = OneResult.MatchsProperty.filter(function (e) {
                            return e.p == SearchVar_ && e.v == resp[k][SearchVar].value;
                            // return e.p == SearchVar_ && e.v == resp[k][SearchVar].value && titledoc == resp[k][TitleVar].value;
                        }).length;

                        if ((OneResult.Type != resp[k][TypeVar].value) || (OneResult.Label != resp[k][TitleVar].value))
                        {
                            ln = 1;
                            //console.log ("Titulo igual");
                            //console.log (resp[k][TitleVar].value);
                            //console.log (resp[k].PropertyLabel.value +" + "+ resp[k].PropertyValue.value );
                        }

                        if (ln == 0)
                        {

                            console.log("Agrupar Sug");

                            var actual = OneResult.MatchsProperty.find(function (val) {
                                return val["p"] == SearchVar_;
                            });
                            console.log(actual);
                            console.log(SearchVar_);
                            // console.log (OneResult.MatchsProperty[resp[k].PropertyLabel.value]);
                            if (actual == undefined) {
                                console.log("No Agrupa");
                                //console.log (resp[k].PropertyLabel.value);
                                OneResult.MatchsProperty.push({p: SearchVar_, v: resp[k][SearchVar].value, l: resp[k][SearchVar].value.length > MaxLength, s: resp[k][SearchVar].value.substr(0, MaxLength), c: resp[k][SearchVar].value.substr(MaxLength)});

                            } else {

                                console.log("Agrupa");
                                var separador = '';
                                if (SearchVar_ == "Subject") {

                                    separador = " , ";
                                } else {
                                    separador = "<br>";
                                }
                                var concatval = actual ["v"] + separador + resp[k][SearchVar].value;
                                console.log(concatval);
                                var valor = OneResult.MatchsProperty.indexOf(actual);
                                console.log(valor);
                                OneResult.MatchsProperty[valor] = {p: SearchVar_, v: concatval, l: concatval.length > MaxLength, s: concatval.substr(0, MaxLength), c: concatval.substr(MaxLength)};


                            }
                            // OneResult.MatchsProperty.push({p: SearchVar_, v: resp[k][SearchVar].value, l: resp[k][SearchVar].value.length > MaxLength, s: resp[k][SearchVar].value.substr(0, MaxLength), c: resp[k][SearchVar].value.substr(MaxLength)});
                        }
                    }
                    OneResult.MatchsProperty.sort(compare2);

                }

            }
        }
//toShow.sort(compare);

        return toShow;
    }

    function compare(a, b) {
        if (a.Weight < b.Weight)
            return 1;
        if (a.Weight > b.Weight)
            return -1;
        return 0;
    }
    function compare2(a, b) {
        if (a.p < b.p)
            return -1;
        if (a.p > b.p)
            return 1;
        return 0;
    }

    function strStartsWith(str, prefix) {
        return str.indexOf(prefix) === 0;
    }


    function logRenders() {
        _.each(Template, function (template, name) {
            var oldRender = template.rendered;
            var counter = 0;

            template.rendered = function () {
                console.log(name, "render count: ", ++counter);
                oldRender && oldRender.apply(this, arguments);
            };
        });
    }

    function language() {

        var idiomEng = {
            "semantic-search": "Semantic search",
            "choose-repositories": "Choose the repositories to query with the search engine:", //Seleccione los repositorios sobre los cuales se ejecutaran las búsquedas:
            "start-search-engine": "Start search engine", //Iniciar motor de consulta
            "lblRange": "Range",
            "lblYears": "Years",
            "lblTypes": "Types",
            "lblEndpoints": "Repositories",
            "lblLanguages": "Languages",
            "FoS_0": "Art",
            "FoS_1": "Biology",
            "FoS_2": "Business",
            "FoS_3": "Chemistry",
            "FoS_4": "Computer science",
            "FoS_5": "Economics",
            "FoS_6": "Engineering",
            "FoS_7": "Environmental science",
            "FoS_8": "Geography",
            "FoS_9": "Geology",
            "FoS_10": "History",
            "FoS_11": "Materials science",
            "FoS_12": "Mathematics",
            "FoS_13": "Medicine",
            "FoS_14": "Philosophy",
            "FoS_15": "Physics",
            "FoS_16": "Political science",
            "FoS_17": "Psychology",
            "FoS_18": "Sociology",
            "welcome-title": "Portal of bibliographic data of the University of Cuenca",
            "resources-search": "Search by: Thesis, scientific articles, books, etc.",
            "placeholder-search": "Terms of search",
            "search": "GO",
            "Autores": "Authors",
            "Documentos": "Documents",
            "Colecciones": "Collections",
            "tip-author": "Authors",
            "tip-document": "Documents",
            "tip-collection": "Collections",
            "search-option": "Search by : ",
            "advance-search": "Advance Search",
            "sug": "Suggestions",
            "fac": "Faceted Search",
            "noData": "No Data",
            "text-more": "more",
            "text-less": "less",
            "view-source": "View Source",
            "view-rdf": "View RDF",
            "view-graph": "View Graph",
            "Name": "Name",
            "Title": "Title",
            "Subject": "Subject",
            "subject": "Subject",
            "Language": "Language",
            "Description": "Description",
            "Type": "Type",
            "Abstract": "Abstract",
            "results": " results",
            "No-results": "No results",
            "panel-info": "Panel Info",
            "warning": "Warning",
            "warning-data": "The selected item contains a lot of resources, so it could slow down the exploration. Do you want to display all data ?.",
            "afirmative": "Yes ",
            "sample": "Sample ",
            "More Info": "More Info",
            "dashboard": "DASHBOARD",
            "clean-dash": "Clear dashboard",
            "load-json": "Load JSON",
            "zoom-out": "Zoom out",
            "zoom-in": "Zoom in",
            "query-editor": "Query Editor",
            "graph-query": "Graph Query",
            "query-title": "(*)Query Title",
            "query-des": "Query Description",
            "run-query": "Run Query",
            "save-query": "Save Query",
            "delete-query": "Delete Query",
            "raw-node": "Raw Node",
            "raw-node-value": "Raw Node Value",
            "entity": "Entity",
            "property": "Property",
            "entities": "Entities",
            "properties": "Properties",
            "disp-endpoints": "Available Endpoints",
            "Graph": "Graph",
            "Status": "Status",
            "Optional": "Optional",
            "close": "close",
            "New": "New",
            "graph-url": "Graph URL (Required)",
            "identifier": "Identifier (Required)",
            "graph-color": "Graph Color",
            "load-schema": "Load Schema (It should take a while depending on Graph size)",
            "Register": "Register",
            "val-node": "Node Value",
            "simple-match": "Simple match",
            "save": "Save",
            "console-error": "Console Error",
            "avoid-sparql": "Avoid SPARQL Validation on Client",
            "result-query": "Result Query",
            "delete": "Delete",
            "msg-delete": "Are you sure you want to delete the Endpoint?",
            "template-title": "Template Queries",
            "Home": "Home",
            "Search": "Search",
            "NL Search": "NL Search",
            "Statistics": "Statistics",
            "query-temp": "Query Templates",
            "query-builder": "Query Builder",
            "ava-endpoints": "Available Endpoints",
            "new-endpoint": "New SPARQL endpoint",
            "Help": "Help",
            "Options": "Options",
            "Collections": "Collections",
            "Documents": "Documents",
            "Persons": "Persons",
            "title-g1": "Resources",
            "sub-title-g1": "Total amount of resources within the registered repositories",
            "title-g2": "Repositories",
            "sub-title-g2": "Registered repositories",
            "top-topics": "Top Topics",
            "group-by": "Group by:",
            "Year": "Year",
            "All": "All",
            "top-collections": "Top Collections",
            "Repository": "Repository",
            "top-persons": "Top Persons",
            "Global": "Global",
            "Stats": "Stats",
            "Profile": "Profile",
            "Close": "Close",
            "Change_password": "Change password",
            "Sign_out": "Sign out",
            "Sign_in": "Sign in",
            "Create_account": "Create account",
            "Forgot_password": "Forgot password",
            "Change_password":"Change password",
                    "New_password": "New password",
            "Set_password": "Set password",
            "Current_password": "Current password",
            "New_password":"New password",
                    "My_Profile": "My Profile",
            "Names": "Names",
            "Direction": "Direction",
            "Occupation": "Occupation",
            "Student": "Student",
            "Teacher": "Teacher",
            "Researcher": "Researcher",
            "Other": "Other",
            "Interest_Areas": "Interest Areas",
            "Sciences": "Sciencies",
            "Mathematics": "Mathematics",
            "Literature": "Literature",
            "chemistry": "Chemistry",
            "Email": "Email Address",
            "Spanish": "Spanish",
            "English": "English",
            "Access_Level": "Access Level",
            "User": "Normal User",
            "Advanced_User": "Advanced User",
            "Admin": "Administrator",
            "Send": "Save",
            "Manage": "Manage",
            "Accounts": "Accounts",
            "Users_List": "Users List",
            "wildcard": "suggestion node",
            "Search_History": "Search History",
            "Favorite_Resources": "Favorite Resources",
            "My_Searches": "My Searches",
            "Resource": " Resource",
            "Sources": "Sources",
            "Date": "Date",
            "Filters": "Filters",
            "Search_action": "Search",
            "it": "italien"
        };

        var idiomEsp = {
            "semantic-search": "Búsqueda Semántica",
            "choose-repositories": "Seleccione los repositorios sobre los cuales se ejecutaran las búsquedas:",
            "start-search-engine": "Iniciar motor de consulta",
            "lblRange": "Rango",
            "lblYears": "Años",
            "lblTypes": "Tipos",
            "lblEndpoints": "Repositorios",
            "lblLanguages": "Lenguajes",
            "FoS_0": "Arte",
            "FoS_1": "Biología",
            "FoS_2": "Negocios",
            "FoS_3": "Química",
            "FoS_4": "Ciencias de la computación",
            "FoS_5": "Economía",
            "FoS_6": "Ingeniería",
            "FoS_7": "Ciencias medioambientales",
            "FoS_8": "Geografía",
            "FoS_9": "Geología",
            "FoS_10": "Historia",
            "FoS_11": "Ciencias de los materiales",
            "FoS_12": "Matemáticas",
            "FoS_13": "Medicina",
            "FoS_14": "Filosofía",
            "FoS_15": "Física",
            "FoS_16": "Ciencias políticas",
            "FoS_17": "Psicología",
            "FoS_18": "Sociología",
            "welcome-title": "Portal de datos bibliográficos de la Universidad de Cuenca",
            "resources-search": "Buscando por: Tesis, Articulos, Libros, etc.",
            "placeholder-search": "Terminos de búsqueda",
            "search": "Buscar",
            "Autores": "Autores",
            "Documentos": "Documentos",
            "Colecciones": "Colecciones",
            "tip-author": "Autores",
            "tip-document": "Documentos",
            "tip-collection": "Colecciones",
            "search-option": "Buscando por : ",
            "advance-search": "Búsqueda Avanzada",
            "sug": "Sugerencias",
            "fac": "Filtros",
            "noData": "No hay datos",
            "text-more": "Más",
            "text-less": "Menos",
            "view-source": "Fuente",
            "view-rdf": "RDF",
            "view-graph": "Mas..",
            "Name": "Nombre Completo",
            "First Name": "Nombres",
            "Last Name": "Apellidos",
            "Title": "Título",
            "Subject": "Tema",
            "subject": "Tema",
            "Language": "Idioma",
            "Description": "Descripción",
            "Type": "Tipo",
            "Abstract": "Resumen",
            "results": " resultados",
            "No-results": "Sin resultados",
            "panel-info": "Información",
            "warning": "Atención",
            "warning-data": "El elemento seleccionado contiene una gran cantidad de recursos, por lo que podria relantizar la exploración. ¿Desea desplegar todos los datos?.",
            "afirmative": "Sí ",
            "sample": "Muestra ",
            "More Info": "Más Información",
            "dashboard": "TABLERO",
            "clean-dash": "Limpiar Área",
            "load-json": "Cargar JSON",
            "zoom-out": "Alejar",
            "zoom-in": "Acercar",
            "query-editor": "Editor",
            "graph-query": "Consulta",
            "query-title": "(*)Título de la consulta",
            "query-des": "Descripción de la consulta",
            "run-query": "Ejecutar Consulta",
            "save-query": "Guardar Consulta",
            "delete-query": "Borrar Consulta",
            "raw-node": "Nodo Genérico",
            "raw-node-value": "Valor del Nodo Genérico",
            "entity": "Entidad",
            "property": "Propiedad",
            "entities": "Entidades",
            "properties": "Propiedades",
            "disp-endpoints": "Endpoints Disponibles",
            "Graph": "Grafo",
            "Status": "Estado",
            "Optional": "Opcional",
            "close": "Cerrar",
            "New": "Nuevo",
            "graph-url": "URL del Esquema (Requerido)",
            "identifier": "Identificador (Requirido)",
            "graph-color": "Color del Grafo",
            "load-schema": "Cargar Esquema (Podría tardar un tiempo, dependiendo del tamaño del esquema)",
            "Register": "Registrar",
            "val-node": "Valor del Nodo",
            "simple-match": "Coincidencia Simple",
            "save": "Guardar",
            "console-error": "Consola de Error",
            "avoid-sparql": "Evitar validación del cliente SPARQL",
            "result-query": "Resultado de la consulta",
            "delete": "Borrar",
            "msg-delete": "¿Esta seguro que quiere borrar el endpoint?",
            "template-title": "Plantilla de Consultas",
            "Home": "Inicio",
            "Search": "Buscador",
            "NL Search": "Buscador LN",
            "Statistics": "Estadísticas",
            "query-temp": "Plantilla de Consultas",
            "query-builder": "Constructor de Consultas",
            "ava-endpoints": "Endpoints Disponibles",
            "new-endpoint": "Nuevo SPARQL endpoint",
            "Help": "Ayuda",
            "Options": "Opciones",
            "Collections": "Colecciones",
            "Documents": "Documentos",
            "Persons": "Personas",
            "title-g1": "Recursos",
            "sub-title-g1": "Monto total de recursos dentro de los repositorios registrados",
            "title-g2": "Repositorios",
            "sub-title-g2": "Repositorios Registrados",
            "top-topics": "Temas Destacados",
            "group-by": "Agrupado por:",
            "Year": "Año",
            "All": "Todos",
            "top-collections": "Colecciones Destacadas",
            "Repository": "Repositorios",
            "top-persons": "Personas Destacadas",
            "Global": "Globales",
            "Stats": "Estadísticas",
            "Profile": "Mi Perfil",
            "Close": "Cerrar",
            "Change_password": "Cambiar Contraseña",
            "Sign_out": "Cerrar Sesión",
            "Sign_in": "Registrarse",
            "Create_account": "Crear Cuenta",
            "Forgot_password": "Contraseña Olvidada",
            "Change_password":"Cambiar Contraseña",
                    "New_password": "Nueva Contraseña",
            "Set_password": "Colocar Contraseña",
            "Current_password": "Password Actual",
            "New_password":"Nuevo password",
                    "My_Profile": "Mi Perfil",
            "Names": "Nombres",
            "Direction": "Dirección",
            "Occupation": "Cargo",
            "Student": "Estudiante",
            "Teacher": "Profesor",
            "Researcher": "Investigador",
            "Other": "Otro",
            "Interest_Areas": "Areas de Interes",
            "Sciences": "Ciencias",
            "Mathematics": "Matemáticas",
            "Literature": "Literatura",
            "chemistry": "Química",
            "Email": "Correo Electrónico",
            "Spanish": "Español",
            "English": "Inglés",
            "Access_Level": "Nivel de Acceso",
            "User": "Usuario Básico",
            "Advanced_User": "Usuario Avanzado",
            "Admin": "Administrador",
            "Send": "Guardar",
            "Manage": "Administrar",
            "Accounts": "Cuentas",
            "Users_List": "Lista de Usuarios",
            "wildcard": "nodo de sugerencia",
            "Search_History": "Historial de Búsqueda",
            "Favorite_Resources": "Recursos Favoritos",
            "My_Searches": "Mis Consultas",
            "Resource": " Recurso",
            "Sources": "Fuentes",
            "Date": "Fecha",
            "Filters": "Filtros",
            "Search_action": "Búsqueda",
            "it": "italian"
        };


        lang.init("USER_PROFILE", "es");
        //  lang.init("SESSION","en");
        lang.setDictionnary("es", idiomEsp);
        lang.setDictionnary("en", idiomEng);
        //lang.setDictionnary("it",dicoIt);

    }
    ;

//*
    Template.hello.events({
        'click button': function () {
            console.log('just a test');
        }
    });

    /*
     Template.header.events({

     setEvents: function (divNode) {
     $("#lang-esp").click(function () {
     alert ("Hola");
     lang.init("SESSION","es");
     //   change_language("es");

     });

     $("#lang-en").click(function () {

     // lang.init("SESSION","en");
     // change_language("en");

     });


     }



     });


     Template.header.helpers({
     setEvents: function (divNode) {
     $("#lang-esp").click(function () {
     alert ("Hola");
     lang.init("SESSION","es");
     //   change_language("es");

     });

     $("#lang-en").click(function () {

     // lang.init("SESSION","en");
     // change_language("en");

     });


     }

     });
     */
    function deleteUser(e) {
        alert("borrado");
        console.log("Borradpo");
    }



    Meteor.startup(function () {
        console.log('inicializacion');
        language();
        Hooks.init();
        return $(function () {
            App.router = new Router();
            console.log('inicializacion OK');
            return Backbone.history.start({
                pushState: true
            });
        });
    });





//--------------------------------------
    function Query(endpoint, graph, query) {
        var aux = undefined;
        Meteor.call('runQuery', endpoint, graph, query, function (error, result) {
            if (result) {
                aux = result;
            } else {
                aux = '';
            }

        });
        while (aux === undefined) {
            sleep();
        }
        ;
        return aux;
    }
    function sleep() {
        try {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", 'www.facebook.com', false); // false for synchronous request
            xmlHttp.send(null);
        } catch (e) {


        }
    }





}
