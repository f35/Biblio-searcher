/*
    View logic for the welcome page component
 */
this.WelcomeView = Backbone.View.extend({
  template: null,
  tagName: "div",
  id: "welcome",
  initialize: function(lan) {
    var me;
    me = this;
    //lang.init("SESSION",lan);
    /*
    Template.header.events = {
      "click a": function(e) {
        return App.router.aReplace(e);
      }
    };*/
    return this.template = Blaze.toHTMLWithData(Template.welcomePage, {});
    /*return this.template = Meteor.render(function() {
      var loggedIn, name;
      loggedIn = Meteor.userId() != null;
      if (loggedIn && (Meteor.user() != null) && (Meteor.user().profile != null)) {
        name = Meteor.user().profile.name;
      }
      return Blaze.toHTMLWithData(Template.header, {});
      return Template.header({
        loggedIn: loggedIn,
        name: name
      });

    });*/
  },
  render: function() {
    this.$el.html(this.template);
   //  this.setEvents($('#sparql-content'));
     this.setEvents(this.template);
     console.log('REnder Welcome');
     //var window_height = $(window).height();
     //console.log (window_height);
    // $(".lavel-up-header, .lavel-up-color-overlay").css('min-height', window_height);
   //  $(window).bind('resize', level_up_min_height);


    return this;
  } ,
  setEvents: function (divNode) {
/*
    $("#lang-esp").click(function () {
  language ();
     //lang.init("SESSION","es");
  //   change_language("es");

  });

$("#lang-en").click(function () {
  language ();
   // lang.init("SESSION","en");
  // change_language("en");

  });*/

 /*   alert($("#documentos"));
   $("radio#documentos").on('click', function (ev) {
    //alert($('input:radio[id=documentos]:checked').val());
    $(".recurso").text ("Buscando por: Documentos");
    alert("click");
  });

  $("radio#autores").on('click', function (ev) {
    $(".recurso").text ("Buscando por: Autores");
  });

  $("radio#colecciones").on('click', function (ev) {
    $(".recurso").text ("Buscando por: Colecciones");
  });
  */
  }
});

search_query = function (e) {

    Session.set('welcome', "Hola");
    var obj = e.target;
   // alert(obj);
    /*var obj = e.target;
    if (obj.tagName == "IMG") {
        obj = obj.parentElement;

    }*/
    var result = Meteor.call('findbase', function(error, result) {
               //console.log ("Querys");
               console.log (result);
            //   alert (result);
          //  alert ("Hola");


   // var en = Endpoints.find({name: obj.attributes['data-endpoint'].value}).fetch()[0]
    var v1 = encodeURIComponent($('input:text[name=terms]').val());
    var v2 = encodeURIComponent($('input:radio[name=opciones]:checked').val());
    var v3 = encodeURIComponent(result.name);
    window.open('/buscador/search/' + v1 + '/' + v2 + '/' + v3 ,"_self" );
    });
};

Template.welcomePage.helpers({
   user_access: function() {
  if (!_.isNull(Meteor.user())&& !_.isUndefined(Meteor.user())) {

         return true;
    } else {
    return false;
    }

  } });
