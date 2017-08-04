import {
    Meteor
}
from
'meteor/meteor';
var _jquery = require('meteor/jquery');                                                                             // 6
if (Meteor.isServer) {


    var Api = new Restivus({
        useDefaultAuth: true,
        prettyJson: true
    });

ProfileSchema = new SimpleSchema({
idProfile: {
    type: String,
    label: "idProfile"
  //  max: 200
  } ,
nameUser : {
    type:String ,
    label: "NameUser" ,
    max: 200
},
direction: {
    type:String ,
    label: "Direction" ,
    max: 200
},
levelAcademic : {
    type:Number ,
    label: "LevelAcademic" ,
    min: 0,
    max:2
} ,
areasInterest :{
    type:[Number] ,
    label: "InteresArea" ,
} ,
 language:{
    type:String ,
    label: "Language" ,
    regEx: /^es|en$/
 },  password : {
    type:String ,
    label: "Pass" ,
    optional: true
 },
 secMail : {
    type:  String,
   // RegEx: Email
}
  , accessLevel:{
    type:Number ,
    label:"Nivel de Acceso"
  // , max:1
  }
 });

UpdateProfileSchema =  new SimpleSchema({
accessLevel:{
    type:Number ,
    label:"Nivel de Acceso",
    max:2 ,
    min:0
} ,  idProfile: {
    type: String,
    label: "idProfile"
  //  max: 200
  }


});


/*
AccountsTemplates.configure({
    SignUpHook: function () {
      console.log ("Creado") ; }

});*/

Hooks.onCreateUser = function (userId) {
 //alert ("Login");
 var usr = Meteor.users.findOne({'_id':userId});

  Profile.insert({idProfile: userId , nameUser: "", direction: "" , levelAcademic: "0", areasInterest: [], language: "es", password: "", secMail:  usr.emails[0].address , accessLevel: "0"});
  Meteor.users.update({_id:userId}, {$set:{"profile":{ lang: "es" ,  'access':0 }}});
    console.log ("Usuario Creado");
 console.log (usr.emails[0].address);


 };

Accounts.emailTemplates.resetPassword = {
    from (user){
     return "cedia@gmx.com";
    },
  subject(user) {
    //console.log (user);
    if (user.profile.lang ==  "en"){
    return "You request change the password on Fedquest search account";
    } else {
    return " Tu has realizado una petición de cambio de contraseña sobre una cuenta del buscador Fedquest";
    }
  },
  text(user, url) {
    if (user.profile.lang ==  "en"){
    return `Hello!
Click the link below to reset your password.
${url}
If you did not request this email, please ignore it.
Thanks,
Fedquest Administrator
`} else {
return `Hola!
Sigue el enlace a continuación  para continuar el proceso de cambio de password.
${url}
Si no solicitaste este email, por favor ignoralo.
Gracias,
Administrador del sitio Fedquest.
`
}
  },
  html(user, url) {
    // This is where HTML email content would go.
    // See the section about html emails below.
  }
};
function valAccess(id, n) {
    var usuario = Meteor.users.findOne({'_id': id});
    if (usuario.profile.access >= n) {
        return true;
    } else {
        return false;
    }
}


function merge_(obj1, obj2) {
    var result = {};
    for (var key in obj1)
        result[key] = obj1[key];
    for (var key in obj2)
        result[key] = obj2[key];
    return result;
}


String.prototype.hashCode = function () {
    var a = 0, b, c, d;
    if (0 === this.length)
        return a;
    for (b = 0, d = this.length; b < d; b++) {
        c = this.charCodeAt(b);
        a = (a << 5) - a + c;
        a |= 0;
    }
    return a;
};
String.prototype.keyword = function () {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = ["a", "actualmente", "acuerdo", "adelante", "ademas", "además", "adrede", "afirmó", "agregó", "ahi", "ahora", "ahí", "al", "algo", "alguna", "algunas", "alguno", "algunos", "algún", "alli", "allí", "alrededor", "ambos", "ampleamos", "antano", "antaño", "ante", "anterior", "antes", "apenas", "aproximadamente", "aquel", "aquella", "aquellas", "aquello", "aquellos", "aqui", "aquél", "aquélla", "aquéllas", "aquéllos", "aquí", "arriba", "arribaabajo", "aseguró", "asi", "así", "atras", "aun", "aunque", "ayer", "añadió", "aún", "b", "bajo", "bastante", "bien", "breve", "buen", "buena", "buenas", "bueno", "buenos", "c", "cada", "casi", "cerca", "cierta", "ciertas", "cierto", "ciertos", "cinco", "claro", "comentó", "como", "con", "conmigo", "conocer", "conseguimos", "conseguir", "considera", "consideró", "consigo", "consigue", "consiguen", "consigues", "contigo", "contra", "cosas", "creo", "cual", "cuales", "cualquier", "cuando", "cuanta", "cuantas", "cuanto", "cuantos", "cuatro", "cuenta", "cuál", "cuáles", "cuándo", "cuánta", "cuántas", "cuánto", "cuántos", "cómo", "d", "da", "dado", "dan", "dar", "de", "debajo", "debe", "deben", "debido", "decir", "dejó", "del", "delante", "demasiado", "demás", "dentro", "deprisa", "desde", "despacio", "despues", "después", "detras", "detrás", "dia", "dias", "dice", "dicen", "dicho", "dieron", "diferente", "diferentes", "dijeron", "dijo", "dio", "donde", "dos", "durante", "día", "días", "dónde", "e", "ejemplo", "el", "ella", "ellas", "ello", "ellos", "embargo", "empleais", "emplean", "emplear", "empleas", "empleo", "en", "encima", "encuentra", "enfrente", "enseguida", "entonces", "entre", "era", "eramos", "eran", "eras", "eres", "es", "esa", "esas", "ese", "eso", "esos", "esta", "estaba", "estaban", "estado", "estados", "estais", "estamos", "estan", "estar", "estará", "estas", "este", "esto", "estos", "estoy", "estuvo", "está", "están", "ex", "excepto", "existe", "existen", "explicó", "expresó", "f", "fin", "final", "fue", "fuera", "fueron", "fui", "fuimos", "g", "general", "gran", "grandes", "gueno", "h", "ha", "haber", "habia", "habla", "hablan", "habrá", "había", "habían", "hace", "haceis", "hacemos", "hacen", "hacer", "hacerlo", "haces", "hacia", "haciendo", "hago", "han", "hasta", "hay", "haya", "he", "hecho", "hemos", "hicieron", "hizo", "horas", "hoy", "hubo", "i", "igual", "incluso", "indicó", "informo", "informó", "intenta", "intentais", "intentamos", "intentan", "intentar", "intentas", "intento", "ir", "j", "junto", "k", "l", "la", "lado", "largo", "las", "le", "lejos", "les", "llegó", "lleva", "llevar", "lo", "los", "luego", "lugar", "m", "mal", "manera", "manifestó", "mas", "mayor", "me", "mediante", "medio", "mejor", "mencionó", "menos", "menudo", "mi", "mia", "mias", "mientras", "mio", "mios", "mis", "misma", "mismas", "mismo", "mismos", "modo", "momento", "mucha", "muchas", "mucho", "muchos", "muy", "más", "mí", "mía", "mías", "mío", "míos", "n", "nada", "nadie", "ni", "ninguna", "ningunas", "ninguno", "ningunos", "ningún", "no", "nos", "nosotras", "nosotros", "nuestra", "nuestras", "nuestro", "nuestros", "nueva", "nuevas", "nuevo", "nuevos", "nunca", "o", "ocho", "os", "otra", "otras", "otro", "otros", "p", "pais", "para", "parece", "parte", "partir", "pasada", "pasado", "paìs", "peor", "pero", "pesar", "poca", "pocas", "poco", "pocos", "podeis", "podemos", "poder", "podria", "podriais", "podriamos", "podrian", "podrias", "podrá", "podrán", "podría", "podrían", "poner", "por", "porque", "posible", "primer", "primera", "primero", "primeros", "principalmente", "pronto", "propia", "propias", "propio", "propios", "proximo", "próximo", "próximos", "pudo", "pueda", "puede", "pueden", "puedo", "pues", "q", "qeu", "que", "quedó", "queremos", "quien", "quienes", "quiere", "quiza", "quizas", "quizá", "quizás", "quién", "quiénes", "qué", "r", "raras", "realizado", "realizar", "realizó", "repente", "respecto", "s", "sabe", "sabeis", "sabemos", "saben", "saber", "sabes", "salvo", "se", "sea", "sean", "segun", "segunda", "segundo", "según", "seis", "ser", "sera", "será", "serán", "sería", "señaló", "si", "sido", "siempre", "siendo", "siete", "sigue", "siguiente", "sin", "sino", "sobre", "sois", "sola", "solamente", "solas", "solo", "solos", "somos", "son", "soy", "soyos", "su", "supuesto", "sus", "suya", "suyas", "suyo", "sé", "sí", "sólo", "t", "tal", "tambien", "también", "tampoco", "tan", "tanto", "tarde", "te", "temprano", "tendrá", "tendrán", "teneis", "tenemos", "tener", "tenga", "tengo", "tenido", "tenía", "tercera", "ti", "tiempo", "tiene", "tienen", "toda", "todas", "todavia", "todavía", "todo", "todos", "total", "trabaja", "trabajais", "trabajamos", "trabajan", "trabajar", "trabajas", "trabajo", "tras", "trata", "través", "tres", "tu", "tus", "tuvo", "tuya", "tuyas", "tuyo", "tuyos", "tú", "u", "ultimo", "un", "una", "unas", "uno", "unos", "usa", "usais", "usamos", "usan", "usar", "usas", "uso", "usted", "ustedes", "v", "va", "vais", "valor", "vamos", "van", "varias", "varios", "vaya", "veces", "ver", "verdad", "verdadera", "verdadero", "vez", "vosotras", "vosotros", "voy", "vuestra", "vuestras", "vuestro", "vuestros", "w", "x", "y", "ya", "yo", "z", "él", "ésa", "ésas", "ése", "ésos", "ésta", "éstas", "éste", "éstos", "última", "últimas", "último", "últimos"];
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)

    // Review all the words
    for (x = 0; x < words.length; x++) {
        // For each word, check all the stop words
        for (y = 0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, ""); // Trim the word and remove non-alpha

            // Get the stop word
            stop_word = stop_words[y];
            // If the word matches the stop word, remove it from the keywords
            if (word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*" + stop_word + "\\s*$"; // Only word
                regex_str += "|^\\s*" + stop_word + "\\s+"; // First word
                regex_str += "|\\s+" + stop_word + "\\s*$"; // Last word
                regex_str += "|\\s+" + stop_word + "\\s+"; // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}



String.prototype.removeDiacritics = function () {
    var str = this;
    var diacriticsMap = {
        A: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g,
        AA: /[\uA732]/g,
        AE: /[\u00C6\u01FC\u01E2]/g,
        AO: /[\uA734]/g,
        AU: /[\uA736]/g,
        AV: /[\uA738\uA73A]/g,
        AY: /[\uA73C]/g,
        B: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g,
        C: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g,
        D: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g,
        DZ: /[\u01F1\u01C4]/g,
        Dz: /[\u01F2\u01C5]/g,
        E: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g,
        F: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g,
        G: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g,
        H: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g,
        I: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g,
        J: /[\u004A\u24BF\uFF2A\u0134\u0248]/g,
        K: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g,
        L: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g,
        LJ: /[\u01C7]/g,
        Lj: /[\u01C8]/g,
        M: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g,
        N: /[\u004E\u24C3\uFF2E\u01F8\u0143\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g,
        NJ: /[\u01CA]/g,
        Nj: /[\u01CB]/g,
        O: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g,
        OI: /[\u01A2]/g,
        OO: /[\uA74E]/g,
        OU: /[\u0222]/g,
        P: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g,
        Q: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g,
        R: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g,
        S: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g,
        T: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g,
        TZ: /[\uA728]/g,
        U: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g,
        V: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g,
        VY: /[\uA760]/g,
        W: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g,
        X: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g,
        Y: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g,
        Z: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g,
        a: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g,
        aa: /[\uA733]/g,
        ae: /[\u00E6\u01FD\u01E3]/g,
        ao: /[\uA735]/g,
        au: /[\uA737]/g,
        av: /[\uA739\uA73B]/g,
        ay: /[\uA73D]/g,
        b: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g,
        c: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g,
        d: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g,
        dz: /[\u01F3\u01C6]/g,
        e: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g,
        f: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g,
        g: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g,
        h: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g,
        hv: /[\u0195]/g,
        i: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g,
        j: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g,
        k: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g,
        l: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g,
        lj: /[\u01C9]/g,
        m: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g,
        n: /[\u006E\u24DD\uFF4E\u01F9\u0144\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g,
        nj: /[\u01CC]/g,
        o: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g,
        oi: /[\u01A3]/g,
        ou: /[\u0223]/g,
        oo: /[\uA74F]/g,
        p: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g,
        q: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g,
        r: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g,
        s: /[\u0073\u24E2\uFF53\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g,
        ss: /[\u00DF]/g,
        t: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g,
        tz: /[\uA729]/g,
        u: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g,
        v: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g,
        vy: /[\uA761]/g,
        w: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g,
        x: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g,
        y: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g,
        z: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
    };
    for (var x in diacriticsMap) {
        // Iterate through each keys in the above object and perform a replace
        str = str.replace(diacriticsMap[x], x);
    }
    return str;
}

var mlseconds = 0;

function TickTock(msj) {
    var d_d_ = new Date();
    var n_n_ = d_d_.getTime();
    var r = 0;
    if (mlseconds == 0) {
        mlseconds = n_n_;
        r = mlseconds;
    } else {
        r = (n_n_ - mlseconds);
        if (msj) {
            console.log(r);
        }
        mlseconds = 0;
    }
    return r;
}


Array.prototype.unique = function () {
    var a = this;
    a = a.filter(function (item, pos) {
        return a.indexOf(item) == pos;
    });
    return a;
}

var similarity = require("similarity");

function intersect(a, b) {
    if (b.length == 0 || a.length == 0) {
        return 0;
    }
    var t;
    if (b.length > a.length)
    {
        t = b, b = a, a = t;
    } // indexOf to loop over shorter
    return a.filter(function (e) {
        for (var m = 0; m < b.length; m++) {
            var sim = similarity(e, b[m]);
            if (sim > 0.8) {
                b[m] = "";
                return true;
            }
        }
        return false;
    });
}

/*
function Prio_IntA(tx, lsin) {
    var lsmat = [];
    var txtl = tx;
    var txtl_ = txtl.split(" ").unique().filter(function (d) {
        return d !== "";
    });
    var nu1 = txtl_.length;
    for (var i = 0; i < lsin.length; i++) {
        var txtl_2 = lsin[i];
        var nu2 = txtl_2.length;
        if (nu1 > 0 || nu2 > 0) {
            var vin = intersect(txtl_.slice(0), txtl_2.slice(0)).length / (nu1 < nu2 ? nu1 : nu2);
            if (vin > 0.9) {
                lsmat.push(i % 19);
                lsin[i] = [];
            }
        }
    }
    return lsmat;
}
*/



/*

function Prio(idc, cons, ord, pon, idi, e, f, t, lsi) {


    var key = idc + '_' + JSON.stringify(cons) + '_' + JSON.stringify(ord) + '_' + pon + '_' + idi + '_' + JSON.stringify(lsi);

    //console.log('key'+key);


   var kwq = Cache.find({keyk: key.hashCode()}).fetch();

    var k = null;

    if (kwq.length == 0) {
        TickTock(true);
        if (ord != null) {
            k = Cache.find(cons, ord).fetch();
        } else {
            k = Cache.find(cons).fetch();
        }

        if (k.length == 0) {
            return k;
        }

        var cach=true;

        var rob = {};
        for (var ii = 0; ii < k.length; ii++) {
            k[ii].score = Number(k[ii].score);
            var ponn = 1;
            if (rob[k[ii].uri + ''] != undefined) {
                ponn = rob[k[ii].uri + ''];
            } else {

                if (k[ii].faceted[3].value != null && (k[ii].faceted[3].value == 'http://purl.org/net/nknouf/ns/bibtex#Mastersthesis' || k[ii].faceted[3].value == 'http://purl.org/ontology/bibo/Article')) {
                    //k[ii].score = k[ii].score * pon;
                    //console.log('type'+k[ii].uri+k[ii].score);
                    ponn += pon +2;
                }
                if (k[ii].faceted[2].value != null && (k[ii].faceted[2].value == idi)) {
                    //k[ii].score = k[ii].score * 3;
                    //console.log('lang'+k[ii].uri+k[ii].score);
                    ponn += 2;
                }
                if (!Array.isArray(k[ii].sub)){
                    cach=false;
                }

                if (k[ii].sub !== null && Array.isArray(k[ii].sub) && k[ii].sub.length > 0) {
                    for (var tss = 0; tss < lsi.length; tss++) {
                        for (var tssz = 0; tssz < k[ii].sub.length; tssz++) {
                            if (lsi[tss] == k[ii].sub[tssz]) {
                                //k[ii].score = k[ii].score * 2;
                                ponn += 3;
                                console.log('inter ' + k[ii].uri +' '+ k[ii].score);
                                break;
                            }
                        }

                    }
                }
                rob[k[ii].uri + ''] = ponn;

            }
            k[ii].score = k[ii].score * ponn;

        }
        k = _.sortBy(k, function (o) {
            return -1 * o.score;
        })
        var r__ = {};
        var s__ = 0;
        for (var ii = 0; ii < k.length; ii++) {
            //console.log(k[ii].uri+'  '+k[ii].score);
            if (r__['' + k[ii].uri] == undefined) {
                r__['' + k[ii].uri] = s__;
                s__++;
            }
            k[ii].nresult = r__['' + k[ii].uri];
        }
        //k=k.sort(function (a,b){ return a.nresult>b.nresult;});
        k = _.sortBy(k, function (o) {
            return o.nresult;
        })


        if(cach){
            Cache.insert({keyk: key.hashCode(), result: k, ttl_date: new Date()});
        }

        TickTock(true);
    } else {
        k = kwq[0].result;
    }
    if (t) {
        k = k.filter(function (d) {
            return d.nresult >= e && d.nresult < e + f;
        });
    }
    return k;
}
*/

var num_auto=0;

    Meteor.startup(function () {


            SyncedCron.add({
      name: 'UpdateStats',
      schedule: function(parser) {
        // parser is a later.parse object
//        return parser.text('every 24 hours');
        return parser.text('every 168 hours');

      },
      job: function() {
          try{
            Meteor.call('updateStats');
          }catch(e){
            console.log('Error en  estadisticas');
            console.log(e);
          }
        return 0;
      }
    });
    /*
    SyncedCron.add({
      name: 'ProfileBasedBoosting',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 seconds');
      },
      job: function() {
        var lsareintP = [];
        var englsar = {"FoS_0": "Art",
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
                            "FoS_18": "Sociology"};
                        var esplsar = {"FoS_0": "Arte",
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
                            "FoS_18": "Sociología"};



          for (;;){

              var lsareintP=[];
              var lsnn = [];
                            for (var ik = 0; ik < 19; ik++) {
                                lsareintP.push(englsar['FoS_' + ik]);
                            }
                            for (var ik = 0; ik < 19; ik++) {
                                lsareintP.push(esplsar['FoS_' + ik]);
                            }
                            lsnn = lsareintP;
                            for (var n = 0; n < lsnn.length; n++) {
                                lsnn[n] = lsnn[n].removeDiacritics().keyword().trim().toLowerCase().split(" ").unique().filter(function (d) {
                                    return d !== "";
                                });
                            }
                            lsareintP = lsnn;

              var OnePri = Cache.findOne({keyp: {$exists: true}});
              if (OnePri){
                  var ky = OnePri.keyp;
                  var resu= Cache.find({key:ky}).fetch();
                  var r_Sub ={};
                  for (var i=0; i<resu.length; i++){

                      var v = resu[i].uri;
                      var sub__=resu[i].sub;
                      //console.log(sub__);
                      var fSub=null;
                      if (r_Sub["" + v] != undefined) {
                        fSub = r_Sub["" + v];
                      } else {
                        if (sub__ != undefined && sub__ != null) {
                                            var lsnn = sub__.removeDiacritics().keyword().trim().toLowerCase().split('#|#').unique().filter(function (d) {
                                                return d !== "";
                                            });
                                            var rresy = [];
                                            var lsareintPP = lsareintP.slice(0);
                                            for (var kw = 0; kw < lsnn.length; kw++) {
                                                var areinc = Prio_IntA(lsnn[kw], lsareintPP);
                                                rresy = rresy.concat(areinc);
                                            }
                                            fSub = rresy.unique();
                        }
                        r_Sub["" + v] = fSub;
                    }
                    //Cache.update({keyl: sug.queue}, {$set: {value: unique.slice(0, 5), cacheable: false, ttl_date: new Date()}});
                    Cache.update({'_id':resu[i]['_id']}, {$set: {sub:fSub}});
                  }
                  Cache.remove({keyp:ky});
              }else{
                  Meteor._sleepForMs(1000);
              }
          }




      }
    });
    */


    SyncedCron.add({
      name: 'UpdateSugg',
      schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 seconds');
      },
      job: function() {
	var endp = Endpoints.find().fetch();
        for (; ; ) {
            var pend = Cache.find({queue: {$exists: true}}, {sort: {qord: -1}, limit: 1}).fetch();
            if (pend.length == 0) {
                endp = Endpoints.find().fetch();
                Meteor._sleepForMs(500);
                continue;
            }
            var sug = pend[0];
            if (sug.resp.length != 0) {
                var sidat = Cache.find({queue: {$exists: true}, resp: {$size: 0}}, {sort: {qord: -1}, limit: 1}).fetch();
                if (sidat.length > 0) {
                    sug = sidat[0];
                }
            }
            var query = sug.query;
            var clas_ = sug.clas_;
            var lsend = sug.lsend;
            var cont = sug.cont;
            var resp = sug.resp;
            var spar = "select distinct ?p ?Score { (?e ?Score ?p) <http://jena.apache.org/text#query> (<---> '___' 3) } order by desc(?Score)";
            spar = spar.replace(new RegExp("___", "g"), query);
            var proper = [];
            switch (clas_) {
                case 'P':
                    proper.push('http://xmlns.com/foaf/0.1/name');
                    break;
                case 'D':
                    proper.push('http://purl.org/dc/terms/subject');
                    proper.push('http://purl.org/dc/terms/title');
                    break;
                case 'C':
                    proper.push('http://purl.org/dc/terms/description');
                    break;
                case 'T':
                    proper.push('http://xmlns.com/foaf/0.1/name');
                    proper.push('http://purl.org/dc/terms/subject');
                    proper.push('http://purl.org/dc/terms/description');
                    proper.push('http://purl.org/dc/terms/title');
                    break;
            }
            if (lsend == null) {
                var foo = [];
                for (var i = 0; i < endp.length; i++) {
                    foo.push(i);
                }
                lsend = foo;
            }
            var endpoint_i = Math.floor(cont / proper.length);
            var prope_i = cont % proper.length;
            var endpoint = endp[lsend[endpoint_i]];
            var _spar = spar.replace(new RegExp("---", "g"), proper[prope_i]);
            var objQuery={sparql: _spar, ep: endpoint.endpoint, gr: endpoint.graphURI};
            var result = Meteor.call('doQueryCacheStats', objQuery);

            if (result == null || result == undefined || result.resultSet == null || result.resultSet== undefined || result.resultSet.value == null || result.resultSet.value== undefined )
            {
                console.log('Error Sugg_ '+JSON.stringify(objQuery));
                continue;
            }
            //
            try {
              var r = result.resultSet.value;

              var lsp = JSON.parse(r).results.bindings;
              for (var k = 0; k < lsp.length; k++) {
                  resp.push({d: lsp[k].p.value, s: lsp[k].Score.value});
              }
            } catch (e) {
                console.log("error en doQueryCacheStats ");
            } finally {

            }

            var respo = resp.sort(function (a, b) {
                return b.s - a.s;
            });
            var resp2 = respo.map(function (d) {
                return d.d;
            });
            var unique = resp2.filter(function (elem, index, self) {
                var indx = -1;
                for (var w = 0; w < self.length; w++) {
                    if (self[w].removeDiacritics().toLowerCase() == elem.removeDiacritics().toLowerCase()) {
                        indx = w;
                    }
                }
                return index == indx;
            });
            if (cont == 0) {
                Cache.insert({keyl: sug.queue, value: unique.slice(0, 5), cacheable: false, ttl_date: new Date()});
            } else {
                Cache.update({keyl: sug.queue}, {$set: {value: unique.slice(0, 5), cacheable: false, ttl_date: new Date()}}, {multi:true});
            }
            if (lsend.length - 1 == endpoint_i && prope_i == proper.length - 1) {
                Cache.update({keyl: sug.queue}, {$set: {cacheable: true}}, {multi:true});
                Cache.remove({queue: sug.queue});
            } else {
                cont = cont + 1;
                Cache.update({queue: sug.queue}, {$set: {cont: cont, resp: resp}}, {multi:true});
            }
        }


        return 0;
      }
    });



    //   process.env.MAIL_URL = 'smtp://postmaster@sandboxee5ed2bda25d49ec855b09c230fdbf1f.mailgun.org:c2489aa5122a827541a4a412eea7ee83@smtp.mailgun.org:587';
     //  process.env.MAIL_URL = 'smtp://postmaster@mg.fedquest.cedia.org.ec:6a3bb4be5642a51f37c6234b7626bd9e@smtp.mailgun.org:587';

      //process.env.MAIL_URL = 'smtp://jortizvivar%40yahoo.es:cedia1123@smtp-pulse.com:465/';
      //process.env.MAIL_URL="smtp://joesega7%40gmail.com:xxxxx@smtp.gmail.com:465/";
    //  process.env.MAIL_URL="smtp://joesega97%40hotmail.com:xxxxxx@smtp.live.com:465/";


        process.env.MAIL_URL = 'smtp://cedia%40gmx.com:cedia1123@smtp.gmx.com:465/';


        Properties._ensureIndex({'endpoint': 1, 'graphURI': 1});

        Cache._ensureIndex({'key': 1, 'original':-1});
        Cache._ensureIndex({'key': 1, 'firstResult':-1, 'faceted.key':1, 'faceted.value':1});
        Cache._ensureIndex({'key': 1, 'faceted.key':1, 'faceted.value':1});
        Cache._ensureIndex({'key': 1} );
        Cache._ensureIndex({'keyl': 1});

        Cache._ensureIndex({'key': 1, 'nresult':1});
        Cache._ensureIndex({'ttl_date': 1}, {'expireAfterSeconds':1209600});
        Cache._ensureIndex({'queue': 1,'qord':-1});
        Cache._ensureIndex({'queue': 1});

        // code to run on server at startup
        //Meteor.call('getEndpointStructure', 'http://190.15.141.102:8890/sparql', 'http://dspace.ucuenca.edu.ec/resource/');
        //Meteor.call('pingServer', 'http://190.15.141.102:8890/sparql');

        var SparqlParser = Meteor.npmRequire('sparqljs').Parser;
        var parserInstance = new SparqlParser();


Api.addRoute('sparql', {authRequired: false}, {
    post:function (){


        var Body=this.request.body.query;
        var Headers=this.request.headers;

        //console.log(Body);
        //console.log(Headers);
        var endpointBase = Endpoints.findOne({base: true}).endpoint;
        var j = Body.trim().hashCode();
        var k = Cache.findOne({key: j});
        var l = {};

        if (!k){
            console.log('Consulta');
            var w = HTTP.post(endpointBase, {params: {query: Body}, headers: {'Accept': 'application/sparql-results+xml','content-type': 'application/x-www-form-urlencoded'}});
            l=w.content;
            Cache.insert({key:j, data:l, ttl_date: new Date()});
        }else{
            l=k.data;
            console.log('Cache');
        }
            this.response.setHeader("Access-Control-Allow-Origin", "*");
            this.response.setHeader("Content-Type", "application/sparql-results+xml");
            this.response.setHeader("Transfer-Encoding", "chunked");

            this.response.write(l+'');
            this.done();



     //return "Esto es un string";
    }
});




        Meteor.methods({
            eventsOnHooksInit: function () {},
            updateStats: function () {

                var __mongo_stats = [];
                var endp = Endpoints.find().fetch();
                //Numero totales
                var sparql_p = "select (count(*) AS ?P) ('__' AS ?EP) {?x a <http://xmlns.com/foaf/0.1/Person>}";
                var sparql_d = "select (count(*) AS ?D) ('__' AS ?EP) {?x a <http://purl.org/ontology/bibo/Document>}";
                var sparql_c = "select (count(*) AS ?C) ('__' AS ?EP) {?x a <http://purl.org/ontology/bibo/Collection>}";
                //Consulta
                var sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_p.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}union' + '\n';
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_d.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}union' + '\n';
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_c.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                //Preprocesamiento
                var r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                var Obj = JSON.parse(r).results.bindings;
                var Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });
                    var result1 = {};
                    var result = {};
                    result1 = merge_(ls[0], ls[1]);
                    result = merge_(result1, ls[2]);
                    Stats1.push(result);
                }
                //Statsc.insert({cod: 1, val: Stats1});
                __mongo_stats.push({cod: 1, val: Stats1});
                var Stats__ = Stats1;
                //console.log(Stats1);
                //Numero recursos totales

                //Palabras clave
                var topK = '20';
                sparql_ = "select * {service <==>{ select  ?D (count(*) AS ?cou) ('__' AS ?EP) where { { [] <http://purl.org/saws/ontology#refersTo> ?d . BIND (lcase(?d) AS ?D) }union{ [] <http://purl.org/dc/terms/subject> ?d . filter (isLiteral (?d)) . BIND (lcase(?d) AS ?D) }union{  [] <http://vivoweb.org/ontology/core#freetextKeyword> ?d . BIND (lcase(?d) AS ?D) } } group by ?D order by desc(?cou) limit " + topK + ' }} ';
                var lsKW = [];
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    var r = Meteor.call('doQueryCacheStats', {sparql: sparql_.replace(new RegExp("__", "g"), endpoint.name).replace(new RegExp("==", "g"), endpoint.endpoint)}).resultSet.value;
                    var Obj1 = JSON.parse(r).results.bindings;
                    var stopWords = ['cuenca-ecuador', 'ecuador', 'cuenca', 'azuay', 'tesis', 'quito', 'quito-ecuador', 'guayaquil'];
                    Obj1_ = Obj1.filter(function (a) {
                        return stopWords.indexOf(a.D.value.trim()) == -1;
                    });
                    lsKW.push({EP: endpoint.name, Data: Obj1_});
                }
                //Statsc.insert();
                __mongo_stats.push({cod: 2, val: lsKW});
                //Palabras clave
                //Por tipo de documento

                var sparql_td = "select ?t ?l ?y (count (*) as ?c) ('__' AS ?EP) { ?d a <http://purl.org/ontology/bibo/Document> . ?d a ?t . ?d <http://purl.org/dc/terms/language> ?l. ?d <http://purl.org/dc/terms/issued> ?y2. bind( strbefore( ?y2, '-' ) as ?y3 ).  bind( strafter( ?y2, ' ' ) as ?y4 ). bind( if (str(?y3)='' && str(?y4)='',?y2,if(str(?y3)='',?y4,?y3)) as ?y ). } group by ?t ?l ?y";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                //console.log(sparql_);
                Obj = JSON.parse(r).results.bindings;
                Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });
                    Stats1.push({EP: endp[i].name, val: ls});
                }
                //Statsc.insert();
                __mongo_stats.push({cod: 3, val: Stats1});
        //Por tipo de documento
        //
        //Autores por tipo de contribucion
                //sparql_td = "select ?p (count (*) as ?c) ('__' AS ?EP) {  select distinct ?a ?p {   ?a a <http://xmlns.com/foaf/0.1/Person> .   ?a ?p ?v.    ?v a <http://purl.org/ontology/bibo/Document>  } } group by ?p ";
                sparql_td = "select ?p ?c ('__' AS ?EP) { {select (count(*) as ?c) (IRI('http://rdaregistry.info/Elements/a/P50161') as ?p) {  select distinct ?a {   ?a a <http://xmlns.com/foaf/0.1/Person> .   ?a <http://rdaregistry.info/Elements/a/P50161> [].  } }} union { select (count(*) as ?c) (IRI('http://rdaregistry.info/Elements/a/P50195') as ?p) {  select distinct ?a {   ?a a <http://xmlns.com/foaf/0.1/Person> .   ?a <http://rdaregistry.info/Elements/a/P50195> [].  } }} }";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                //console.log(sparql_);
                Obj = JSON.parse(r).results.bindings;
                Stats1 = [];
                for (var i = 0; i < endp.length; i++) {
                    var ls = Obj.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    });
                    var TotDoc = Stats__.filter(function (a) {
                        return a.EP.value == endp[i].name;
                    }) [0];
                    Stats1.push({EP: endp[i].name, val: {total: Number(TotDoc.P.value), val: ls}});
                }
                //Statsc.insert();
                __mongo_stats.push({cod: 4, val: Stats1});
        //Autores por tipo de contribucion
        //Top Autores
                var topKA = 20;
                sparql_td = "select ?a (max (?n) as ?name) (max (?coun) as ?counter) ('__' AS ?EP) {   ?a <http://xmlns.com/foaf/0.1/name> ?n.   {      select ?a (count(*) as ?coun)      {         { ?a <http://rdaregistry.info/Elements/a/P50195> [] }union{ ?a <http://rdaregistry.info/Elements/a/P50161> []}     } group by (?a) order by desc (?coun) limit " + topKA + "    } } group by (?a) order by desc(?co)";
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '} order by desc (?coun)';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                Obj = JSON.parse(r).results.bindings;
                Stats1 = Obj;
                //Statsc.insert();
                __mongo_stats.push({cod: 5, val: Stats1});
        //Top Autores


        //Colecciones
                var topKC = 20000;
                sparql_td = "select ?c (max(?n) as ?name) (count(*) as ?counter) ('__' AS ?EP) {    ?c a <http://purl.org/ontology/bibo/Collection>.    ?c <http://purl.org/dc/terms/description> ?n.   ?d <http://purl.org/dc/terms/isPartOf> ?c. } group by ?c order by desc (?co) limit " + topKC;
                sparql_ = 'select * {\n';
                for (var i = 0; i < endp.length; i++) {
                    var endpoint = endp[i];
                    sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
                    sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
                    sparql_ += '}}' + '\n';
                    if (i != endp.length - 1) {
                        sparql_ += 'union' + '\n';
                    }
                }
                sparql_ += '}  order by desc (?counter)';
                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                Obj = JSON.parse(r).results.bindings;
                var StopWords2 = ['Tesis de Grado - ', 'Tesis en ', 'Carrera de ', 'Facultad de ', 'Tesis - Carrera de ', 'Tesis - ', 'Tesis de ', 'Instituto de ', 'Facultad ', 'Licenciatura en ', 'Tesis ', 'Escuela de ', 'Exámenes - '];
                for (var i = 0; i < Obj.length; i++) {
                    for (var j = 0; j < StopWords2.length; j++) {
                        if (!Obj[i].name) {
                            Obj[i].name = {value: "No collections"};
                            Obj[i].counter.value = 1;
                        }
                        Obj[i].name.value = Obj[i].name.value.replace(new RegExp(StopWords2[j], "g"), '');
                    }
                    //Obj[i].name.value = Obj[i].name.value.toLowerCase();
                }

                /*
                 var result = [];
                 Obj.reduce(function (res, value) {
                 if (!res[value.name.value]) {
                 res[value.name.value] = {
                 counter: 0,
                 name: value.name.value,
                 c: value.c.value,
                 EP: value.EP.value
                 };
                 result.push(res[value.name.value])
                 }
                 res[value.name.value].qty += Number(value.counter.value);
                 return res;
                 }, {});
                 */
                Stats1 = Obj;
                __mongo_stats.push({cod: 6, val: Stats1});
        //Colecciones


        //Por organization
        var sparql_td =" select  ?org ?de  (count (?d) as ?count) ('__' AS ?EP) "
            sparql_td +=' { ?d a <http://purl.org/ontology/bibo/Document> .'
            sparql_td +=' ?d <http://purl.org/dc/terms/provenance> ?org. '
            sparql_td +='   ?org a <http://xmlns.com/foaf/0.1/Organization>.'
            sparql_td +='   ?org <http://purl.org/dc/terms/description> ?de'
            sparql_td +='  } '
            sparql_td +=' group by ?org ?de';


        sparql_ = 'select * {\n';
        for (var i = 0; i < endp.length; i++) {
            var endpoint = endp[i];
            sparql_ += '{service <' + endpoint.endpoint + '> {' + '\n';
            sparql_ += sparql_td.replace(new RegExp("__", "g"), endpoint.name) + '\n';
            sparql_ += '}}' + '\n';
            if (i != endp.length - 1) {
                sparql_ += 'union' + '\n';
            }
        }

                sparql_ += '}';

                r = Meteor.call('doQueryCacheStats', {sparql: sparql_}).resultSet.value;
                Obj = JSON.parse(r).results.bindings;
                Stats1 = Obj;
                  //  console.log('CONSULTA 7:'+Stats1);
                //Statsc.insert();
                __mongo_stats.push({cod: 7, val: Stats1});


                Statsc.remove({});
                for (var i = 0; i < __mongo_stats.length; i++) {
                    Statsc.insert(__mongo_stats[i]);
                }



            },
            validateSPARQL: function (sparqlQuery) {
                var response = {};
                try {
                    parserInstance.parse(sparqlQuery);
                    response.statusCode = 200;
                    response.msg = "OK";
                } catch (e) {
                    response.statusCode = 400;
                    response.msg = 'Error parsing SPARQL Query';
                    response.stack = e.toString();
                }
                return response;
            },doQuery2: function (jsonRequest) {
                var timeout = jsonRequest.timeout ? jsonRequest.timeout : 30000
                var response = {}
                response.statusCode = 200;
                response.msg = undefined;
                response.stack = undefined;
                var endpointBase = Endpoints.findOne({base: true});
                if (!endpointBase) {
                    response.statusCode = 400;
                    response.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (jsonRequest.validateQuery) {
                            parserInstance.parse(jsonRequest.sparql);
                        } else {
                            console.log('==Avoiding SPARQL validation on client');
                        }
                        var j = (jsonRequest.sparql+'Query2').trim().hashCode();
                        var k = Cache.findOne({key: j});
                        if(!k){
                            response.resultSet = Meteor.call('runQuery', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, undefined, timeout);
                            Cache.insert({key:j, data:response.resultSet, ttl_date: new Date() });
                        }else{
                            response.resultSet=k.data;
                        }

                    } catch (e) {
                        console.log(e);
                        response.statusCode = 400;
                        response.msg = "Error executing SPARQL Query: See console for details";
                        response.stack = e.toString();
                    }
                }
                return response;
            },
            doQuery: function (jsonRequest) {
                console.log('ConsultaQ');
                //console.log(jsonRequest);
                var timeout = jsonRequest.timeout ? jsonRequest.timeout : 300000
                var response = {}
                response.statusCode = 200;
                response.msg = undefined;
                response.stack = undefined;
                var endpointBase = Endpoints.findOne({base: true});
                if (!endpointBase) {
                    response.statusCode = 400;
                    response.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (jsonRequest.validateQuery) {
                            parserInstance.parse(jsonRequest.sparql);
                        } else {
                            console.log('==Avoiding SPARQL validation on client');
                        }
                        response.resultSet = Meteor.call('runQuery', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, undefined, timeout,endpointBase.typeServer);
                    } catch (e) {
                        console.log(e);
                        response.statusCode = 400;
                        response.msg = "Error executing SPARQL Query: See console for details";
                        response.stack = e.toString();
                    }
                }
                return response;
            },
            doQueryCacheStats: function (a) {
                var f = a.fast != undefined ? a.fast : false;
                var g = a.timeout ? a.timeout : 30000;
                var h = {};
                var lr = false;
                h.statusCode = 200;
                h.msg = void 0;
                h.stack = void 0;
                var i = Endpoints.findOne({
                    base: true
                });
                if (!i) {
                    h.statusCode = 400;
                    h.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        var aep = a.ep != undefined ? a.ep : i.endpoint;
                        var agr = a.gr != undefined ? a.gr : i.graphURI;
                        var j = (aep + agr + a.sparql).trim().hashCode();
                        var k = Cache.find({key: j}).fetch();
                        var l = {};

                        if (0 == k.length && !f) {
                            lr = true;
                            l = Meteor.call("runQuery", aep, agr, a.sparql, undefined, g);
                            Cache.insert({
                                key: j,
                                value: l.content,
                                ttl_date: new Date(),
                                nresult: 0,
                                original: true
                            });
                            k = Cache.find({key: j}).fetch();
                        }
                        h.resultSet = (0 != k.length) ? k[0] : {};
                    } catch (C) {
                        console.log(C.stack);
                        h.statusCode = 400;
                        h.msg = "Error executing SPARQL Query: See console for details";
                        h.stack = C.toString();
                    }
                }
                h.lr = lr;
                return h;
            },
            doQueryCache: function (a) {
                var FacSe = a.Faceted ? a.Faceted : [];
                var c = a.ApplyFilter ? a.ApplyFilter : false;
                var d = a.MainVar ? a.MainVar : "";
                var e = a.offset ? a.offset : 0;
                var f = a.limit ? a.limit : 10;
                var g = a.timeout ? a.timeout : 30000;
                var h = {};
                h.statusCode = 200;
                h.msg = void 0;
                h.stack = void 0;
                var i = Endpoints.findOne({
                    base: true
                });
                if (!i) {
                    h.statusCode = 400;
                    h.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (a.validateQuery) {
                            b.parse(a.sparql);
                        } else {
                            console.log("==Avoiding SPARQL validation on client");
                        }
                        var j = a.sparql.trim().hashCode();
                        //console.log(j);
                        //Get profile
                        /*
                        var usr = Profile.findOne({idProfile: this.userId});
                        var appPri = false;
                        var pon = 1;
                        var idi = null;
                        var lsareint = [];
                        var lsareintP = [];
                        //console.log(usr);

                        var englsar = {"FoS_0": "Art",
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
                            "FoS_18": "Sociology"};
                        var esplsar = {"FoS_0": "Arte",
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
                            "FoS_18": "Sociología"};
                        // console.log(this.userId);
                        if (usr) {
                            //   console.log(usr);

                            appPri = true;
                            if (usr.levelAcademic == 1) {
                                pon = 2;
                            }
                            if (usr.levelAcademic == 2) {
                                pon = 3;
                            }
                            if (usr.areasInterest != undefined && Array.isArray(usr.areasInterest)) {
                                lsareint = usr.areasInterest;
                            }

                            var lsnn = [];
                            for (var ik = 0; ik < 19; ik++) {
                                lsareintP.push(englsar['FoS_' + ik]);
                            }
                            for (var ik = 0; ik < 19; ik++) {
                                lsareintP.push(esplsar['FoS_' + ik]);
                            }
                            lsnn = lsareintP;
                            for (var n = 0; n < lsnn.length; n++) {
                                lsnn[n] = lsnn[n].removeDiacritics().keyword().trim().toLowerCase().split(" ").unique().filter(function (d) {
                                    return d !== "";
                                });
                            }
                            lsareintP = lsnn;
                            idi = usr.language;
                        }
                        */
                        //
                        //
                        ///Faceted
                        if (FacSe.length != 0) {
                            var kFaceted = Cache.findOne({key: j});
                            if (kFaceted) {
                                var all = [];
                                for (var j_ = 0; j_ < FacSe.length; j_++) {
                                    var all_ = {}
                                    var fac = FacSe[j_];
                                    if (fac.key == 'Year') {
                                        var i__ = fac.value[0];
                                        var f__ = fac.value[1];
                                        all_ = {$or: [{faceted: {$elemMatch: {key: 'Year', value: {$gte: i__, $lte: f__}}}}, {faceted: {$elemMatch: {key: 'Year', value: null}}}]};
                                    } else {
                                        var or_ = [];
                                        for (var q = 0; q < fac.value.length; q++) {
                                            or_.push({faceted: {$elemMatch: {key: fac.key, value: fac.value[q]}}});
                                        }
                                        if (or_.length > 0) {
                                            all_ = {$or: or_};
                                        }
                                    }
                                    all.push(all_);
                                }
                                all.push({key: j});
                                //console.log(JSON.stringify({$and : all }));
                                var k = null;
                             //   if (!appPri) {
                                    k = Cache.find({$and: all}, {sort: {nresult: 1, firstResult: -1}}).fetch();
                              ///  } else {
                               //     k = Prio(j, {$and: all}, {sort: {nresult: 1, firstResult: -1}}, pon, idi, e, f, false, lsareint);
                              //  }

                                var k2 = Cache.find({key: j, original: true}, {limit: 1, skip: 0}).fetch();
                                var y = {};
                                var z = {};
                                if (k2.length > 0) {
                                    y = k2[0].value;
                                    z = JSON.parse(y.content);
                                    if (z.results) {
                                        z.results.bindings = [];
                                    }
                                }

                                var r = {};
                                var s = 0;
                                var FacetedResum_Years = [];
                                var FacetedResum_Endpoints = [];
                                var FacetedResum_Langs = [];
                                var FacetedResum_Types = [];
                                for (var t = 0; t < k.length; t++) {
                                    var FA = k[t].faceted;
                                    if (k[t].firstResult) {
                                        var FacetedResum_Years2 = FacetedResum_Years.filter(function (d) {
                                            return d.key == FA[0].value;
                                        });
                                        if (FacetedResum_Years2.length > 0) {
                                            var indx = FacetedResum_Years.indexOf(FacetedResum_Years2[0]);
                                            FacetedResum_Years[indx].count = FacetedResum_Years[indx].count + 1;
                                        } else {
                                            FacetedResum_Years.push({key: FA[0].value, count: 1});
                                        }
                                        var FacetedResum_Endpoints2 = FacetedResum_Endpoints.filter(function (d) {
                                            return d.key == FA[1].value;
                                        });
                                        if (FacetedResum_Endpoints2.length > 0) {
                                            var indx = FacetedResum_Endpoints.indexOf(FacetedResum_Endpoints2[0]);
                                            FacetedResum_Endpoints[indx].count = FacetedResum_Endpoints[indx].count + 1;
                                        } else {
                                            FacetedResum_Endpoints.push({key: FA[1].value, count: 1});
                                        }
                                        var FacetedResum_Langs2 = FacetedResum_Langs.filter(function (d) {
                                            return d.key == FA[2].value;
                                        });
                                        if (FacetedResum_Langs2.length > 0) {
                                            var indx = FacetedResum_Langs.indexOf(FacetedResum_Langs2[0]);
                                            FacetedResum_Langs[indx].count = FacetedResum_Langs[indx].count + 1;
                                        } else {
                                            FacetedResum_Langs.push({key: FA[2].value, count: 1});
                                        }
                                        var FacetedResum_Types2 = FacetedResum_Types.filter(function (d) {
                                            return d.key == FA[3].value;
                                        });
                                        if (FacetedResum_Types2.length > 0) {
                                            var indx = FacetedResum_Types.indexOf(FacetedResum_Types2[0]);
                                            FacetedResum_Types[indx].count = FacetedResum_Types[indx].count + 1;
                                        } else {
                                            FacetedResum_Types.push({key: FA[3].value, count: 1});
                                        }
                                    }
                                    //
                                    var A = k[t].value;
                                    var B = JSON.parse(A.content);
                                    var v = k[t].nresult;
                                    if (r["_" + v] != undefined) {
                                    } else {
                                        r["_" + v] = s;
                                        s += 1;
                                    }
                                    if (r["_" + v] >= e && r["_" + v] < e + f) {
                                        if (B.results) {
                                            if (B.results.bindings.length > 0) {
                                                z.results.bindings.push(B.results.bindings[0]);
                                            }
                                        } else {
                                            z.results.bindings.push(B);
                                        }
                                    }
                                }
                                FacetedResum_Years.sort(function (a, b) {
                                    if (a.key < b.key)
                                        return -1;
                                    if (a.key > b.key)
                                        return 1;
                                    return 0;
                                });
                                FacetedResum_Types.sort(function (a, b) {
                                    if (a.count < b.count)
                                        return 1;
                                    if (a.count > b.count)
                                        return -1;
                                    return 0;
                                });
                                FacetedResum_Endpoints.sort(function (a, b) {
                                    if (a.count < b.count)
                                        return 1;
                                    if (a.count > b.count)
                                        return -1;
                                    return 0;
                                });
                                FacetedResum_Langs.sort(function (a, b) {
                                    if (a.count < b.count)
                                        return 1;
                                    if (a.count > b.count)
                                        return -1;
                                    return 0;
                                });
                                h.facetedTotalsN = {Years: FacetedResum_Years, Endpoints: FacetedResum_Endpoints, Langs: FacetedResum_Langs, Types: FacetedResum_Types};
                                y.content = JSON.stringify(z);
                                h.resultSet = y;
                                h.resultCount = s;
                                return h;
                            }
                        }
                        //Faceted
                        var k = null;
                      //  if (!appPri) {
                            k = Cache.find({
                                key: j,
                                nresult: {
                                    $gte: e,
                                    $lt: e + f
                                }
                            }, {
                                sort: {
                                    nresult: +1
                                }
                            }).fetch();
                     //   } else {
                      //      k = Prio(j, {key: j}, null, pon, idi, e, f, true, lsareint);
                      //  }
                        /////
                        var l = "";
                        var cacheo = false;
                        if (0 == k.length) {
                            cacheo = true;
                            l = Meteor.call("runQuery", i.endpoint, i.graphURI, a.sparql, undefined, g,i.typeServer);
                            //console.log('PRINTtypeserversL'+l.content);
                            var m = JSON.parse(l.content);
                            if (c) {
                                var n = Math.max.apply(Math, m.results.bindings.map(function (a) {
                                    return a.Score.value;
                                }));
                                var o = Math.min.apply(Math, m.results.bindings.map(function (a) {
                                    return a.Score.value;
                                }));
                                var p = .5 * (n - o);
                                m.results.bindings = m.results.bindings.filter(function (a) {
                                    return a.Score.value >= n - p;
                                });
                            }
                            var q = m.results.bindings.length;
                            var r = {};
                            var r_Sub = {};
                            var s = 0;
                            var timi = 0.0;
                            var bulk = [];
                            //TickTock(true);
                            for (var t = 0; t < q; t++) {
                                var un = false;
                                //if (m.results.bindings[t]["" + d] == undefined){
                                   // console.log(m.results.bindings[t]);

                                //}

                                var v = m.results.bindings[t]["" + d].value;
                                if (r["" + v] != undefined) {
                                } else {
                                    un = true;
                                    r["" + v] = s;
                                    s += 1;
                                }
                                var back = l.content;
                                var JSONOut2 = {};
                                var orgi = false;
                                var fType = null;
                                var fEndpoint = null;
                                var fLang = null;
                                var fYear = null;
                                //var fScore = 0.0;
                                //var fSub = null;
                               // if (m.results.bindings[t].Score != undefined) {
                                //    fScore = Number(m.results.bindings[t].Score.value);
                              //  }

                               // if (m.results.bindings[t].Sub != undefined && m.results.bindings[t].Sub != null) {
                              //      fSub=m.results.bindings[t].Sub.value;
                              //  }


                                // if (r_Type["" + v]!= undefined){
                                //   fType=r_Type["" + v];
                                //}else{
                                if (m.results.bindings[t].Type != undefined) {
                                    fType = m.results.bindings[t].Type.value;
                                }
                                //  r_Type["" + v]=fType;
                                // }
                                // if (r_Endpoint["" + v] != undefined){
                                //   fEndpoint = r_Endpoint["" + v];
                                // } else{
                                if (m.results.bindings[t].Endpoint != undefined) {
                                    fEndpoint = m.results.bindings[t].Endpoint.value;
                                }
                                //   r_Endpoint["" + v] = fEndpoint;
                                // }
                                //  if (r_Lang["" + v] != undefined){
                                //    fLang = r_Lang["" + v];
                                //} else{
                                if (m.results.bindings[t].Lang != undefined) {
                                    fLang = m.results.bindings[t].Lang.value;
                                }
                                //   r_Lang["" + v] = fLang;
                                // }
                                // if (r_Year["" + v] != undefined){
                                //    fYear = r_Year["" + v];
                                // } else{
                                if (m.results.bindings[t].Year != undefined) {
                                    fYear = m.results.bindings[t].Year.value;
                                }
                                //    r_Year["" + v] = fYear;
                                // }



                                if (t == 0) {
                                    var u = JSON.parse(l.content);
                                    u.results.bindings = [m.results.bindings[t]];
                                    JSONOut2 = l;
                                    JSONOut2.content = JSON.stringify(u);
                                    orgi = true;
                                } else {
                                    var u = m.results.bindings[t];
                                    JSONOut2 = l;
                                    JSONOut2.content = JSON.stringify(u);
                                    orgi = false;
                                    if (JSONOut2.headers) {
                                        delete JSONOut2.headers;
                                    }
                                    if (JSONOut2.statusCode) {
                                        delete JSONOut2.statusCode;
                                    }
                                }
                                bulk.push({
                                    key: j,
                                    value: JSON.parse(JSON.stringify(JSONOut2)),
                                    ttl_date: new Date(),
                                    nresult: r["" + v],
                                   // score: Number(fScore),
                                    uri: v,
                                   // sub: fSub,
                                    faceted: [{key: 'Year', value: Number(fYear) == 0 || isNaN(Number(fYear)) ? null : Number(fYear)}, {key: 'Endpoint', value: fEndpoint}, {key: 'Lang', value: fLang}, {key: 'Type', value: fType}],
                                    firstResult: un,
                                    original: orgi
                                });
                                /*Cache.insert({
                                 key: j,
                                 value: JSONOut2,
                                 ttl_date: new Date(),
                                 nresult: r["" + v],
                                 score:Number(fScore),
                                 uri:v,
                                 sub:fSub,
                                 faceted: [{key:'Year', value:Number(fYear) == 0 ? null:Number(fYear)  },{key:'Endpoint', value:fEndpoint},{key:'Lang', value:fLang},{key:'Type', value:fType}] ,
                                 firstResult:un,
                                 original: orgi
                                 });*/

                                l.content = back;
                            }
                            //Cache.insert({keyp: j});
                            if (bulk.length>0){
                                Cache.batchInsert(bulk);
                            }

                            //TickTock(true);
                            //Limipiar
                            r = {};
                            r_Sub = {};
                            m = {};
                            l = {};
                            bulk = [];
                          //  if (!appPri) {
                                k = Cache.find({
                                    key: j,
                                    nresult: {
                                        $gte: e,
                                        $lt: e + f
                                    }
                                }, {
                                    sort: {
                                        nresult: +1
                                    }
                                }).fetch();
                          //  } else {
                         //       k = Prio(j, {key: j}, null, pon, idi, e, f, true, lsareint);
                         //   }

                            //////
                            if (0 == q) {
                                k = [{
                                        key: j,
                                        value: l
                                    }];
                            }
                        } else {
                        }

                        if (cacheo) {
                            //console.log('calculo facteted');
                            //Facetas
                            var years = Cache.distinct('faceted.0.value', {key: j, firstResult: true, faceted: {$elemMatch: {key: 'Year'}}});
                            var years2 = [];
                            for (var s = 0; s < years.length; s++) {
                                var re_co = Cache.find({key: j, firstResult: true, faceted: {$elemMatch: {key: 'Year', value: years[s]}}}).count();
                                years2.push({key: years[s], count: re_co});
                            }
                            var endpoints = Cache.distinct('faceted.1.value', {key: j, firstResult: true, faceted: {$elemMatch: {key: 'Endpoint'}}});
                            var endpoints2 = [];
                            for (var s = 0; s < endpoints.length; s++) {
                                var re_co = Cache.find({key: j, firstResult: true, faceted: {$elemMatch: {key: 'Endpoint', value: endpoints[s]}}}).count();
                                endpoints2.push({key: endpoints[s], count: re_co});
                            }
                            var langs = Cache.distinct('faceted.2.value', {key: j, firstResult: true, faceted: {$elemMatch: {key: 'Lang'}}});
                            var langs2 = [];
                            for (var s = 0; s < langs.length; s++) {
                                var re_co = Cache.find({key: j, firstResult: true, faceted: {$elemMatch: {key: 'Lang', value: langs[s]}}}).count();
                                langs2.push({key: langs[s], count: re_co});
                            }
                            var types = Cache.distinct('faceted.3.value', {key: j, firstResult: true, faceted: {$elemMatch: {key: 'Type'}}});
                            //console.log(types+"  "+j);
                            var types2 = [];
                            for (var s = 0; s < types.length; s++) {
                                var re_co = Cache.find({key: j, firstResult: true, faceted: {$elemMatch: {key: 'Type', value: types[s]}}}).count();
                                types2.push({key: types[s], count: re_co});
                            }

                            years2.sort(function (a, b) {
                                if (a.key < b.key)
                                    return -1;
                                if (a.key > b.key)
                                    return 1;
                                return 0;
                            });
                            types2.sort(function (a, b) {
                                if (a.count < b.count)
                                    return 1;
                                if (a.count > b.count)
                                    return -1;
                                return 0;
                            });
                            endpoints2.sort(function (a, b) {
                                if (a.count < b.count)
                                    return 1;
                                if (a.count > b.count)
                                    return -1;
                                return 0;
                            });
                            langs2.sort(function (a, b) {
                                if (a.count < b.count)
                                    return 1;
                                if (a.count > b.count)
                                    return -1;
                                return 0;
                            });
                            years2 = years2.filter(function (d) {
                                return d.count > 0;
                            });
                            types2 = types2.filter(function (d) {
                                return d.count > 0;
                            });
                            endpoints2 = endpoints2.filter(function (d) {
                                return d.count > 0;
                            });
                            langs2 = langs2.filter(function (d) {
                                return d.count > 0;
                            });
                            var k2_up = Cache.update({key: j, original: true}, {$set: {facetedTotals: {Years: years2, Endpoints: endpoints2, Langs: langs2, Types: types2}}});
                        }

                        var w = Cache.find({
                            key: j
                        }, {
                            sort: {
                                nresult: -1
                            },
                            limit: 1
                        }).fetch();
                        var x = 0;
                        if (w.length > 0) {
                            x = w[0].nresult + 1;
                        }
                        var k2 = Cache.find({key: j, original: true}, {limit: 1, skip: 0}).fetch();

                        var y = {};
                        var z = {};
                        var facetedTotals = {};
                        if (k2.length > 0) {
                            y = k2[0].value;
                            facetedTotals = k2[0].facetedTotals;
                            z = JSON.parse(y.content);
                            if (z.results) {
                                z.results.bindings = [];
                            } else {
                                console.log("contenido cache "+y.content);
                            }
                        } else {
                          try{
                            y = k[0].value;
                            z = JSON.parse(y);


                          }catch(error){


                          }

                        }
                        for (var t = 0; t < k.length; t++) {
                            var A = k[t].value;
                            var B = null;
                              try{
                             B = JSON.parse(A.content);
                             if (B.results) {
                                 if (B.results.bindings.length > 0) {
                                     z.results.bindings.push(B.results.bindings[0]);
                                 }
                             } else {
                                 z.results.bindings.push(B);
                             }

                            }catch(error){


                            }

                        }
                        y.content = JSON.stringify(z);
                        h.resultSet = y;
                        h.resultCount = x;
                        h.facetedTotals = facetedTotals;
                    } catch (C) {
                        console.log(C.stack);
                        h.statusCode = 400;
                        h.msg = "Error executing SPARQL Query: See console for details";
                        h.stack = C.toString();
                    }
                }
                return h;
            },
            doQueryDesc: function (jsonRequest, endpoint) {
                console.log('ConsultaQ');
                console.log("doQueryDesc"+jsonRequest);
                var timeout = jsonRequest.timeout ? jsonRequest.timeout : 30000
                var response = {}
                response.statusCode = 200;
                response.msg = undefined;
                response.stack = undefined;
                var endpointBase = endpoint;
                //Endpoints.findOne({base: true});

                if (!endpointBase) {
                    response.statusCode = 400;
                    response.msg = "Base Endpoint is not registered!";
                } else {
                    try {
                        if (jsonRequest.validateQuery) {
                            parserInstance.parse(jsonRequest.sparql);
                        } else {
                            console.log('==Avoiding SPARQL validation on client');
                        }
                        response.resultSet = Meteor.call('runQueryDescr', endpointBase.endpoint, endpointBase.graphURI, jsonRequest.sparql, 'application/ld+json', timeout);
                    } catch (e) {
                        console.log(e);
                        response.statusCode = 400;
                        response.msg = "Error executing SPARQL Query: See console for details";
                        response.stack = e.toString();
                    }
                }
                return response;
            },
            saveQuery: function (request) {
                if (valAccess(this.userId, 1)) {
                    result = {};
                    result.statusCode = 200;
                    result.msg = 'OK';
                    try {
                        var queryMod = Queries.findOne({_id: request._id_});
                        if (queryMod) {

                            if (request.del) {
                                Queries.remove({_id: request._id_});
                            } else {
                                Queries.update({_id: request._id_}, {$set: {user: '', title: request.title, description: request.description,
                                        jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData, commend: request.commend}});
                                result.queryId = request._id_;
                            }
                        } else {
                            var id = Queries.insert({user: '', title: request.title, description: request.description,
                                jsonGraph: JSON.stringify(request.jsonQuery), sparql: request.sparql, image: request.imageData, commend: request.commend});
                            result.queryId = id;
                        }
                    } catch (e) {
                        console.log(e);
                        result.statusCode = 500;
                        result.msg = e
                    }
                    return result;
                } else {
                    return null;
                }
            },
            updatePrefixes: function () {
                HTTP.get('http://prefix.cc/context', function (error, result) {
                    if (result.statusCode == '200' && !error) {
                        result = EJSON.parse(result.content);
                        result = result['@context'];
                        var ci = 0;
                        var ce = 0;
                        if (!_.isUndefined(result)) {
                            for (var prfx in result) {
                                var prfCursor = Prefixes.find({prefix: prfx});
                                if (prfCursor.count() <= 0) {
                                    Prefixes.insert({prefix: prfx, URI: result[prfx]});
                                    ci++;
                                } else {
                                    ce++;
                                }
                            }
                        }
                        console.log('Updating prefixes schema using prefix.cc service: Already Saved: ' + ce + ' New Records: ' + ci);
                    } else {
                        console.log('Error while getting Prefixes from service prefix.cc. Possible cause: ' + error);
                    }
                });
            },
            runQuery: function (endpointURI, defaultGraph, query, format, timeout, typeServer) {
                format = _.isUndefined(format) ? 'application/sparql-results+json' : format;
                timeout = _.isUndefined(timeout) ? '0' : timeout;
                //return HTTP.get(endpointURI,
                var result;
                console.log('marmotta tipo servers'+ typeServer);

                switch(typeServer) {
                  case "Fuseki":
                      result= HTTP.post(endpointURI,
                        {
                            'params':
                                    {
                                        'default-graph-uri': defaultGraph,
                                        'query': query,
                                        'format': format,
                                        'timeout': timeout
                                    }
                        });
                        break;
                case "Apache Marmotta":
                  var options = {
                         params: {
                            "query": query,
                            "output": "json"
                         },
                         headers: {
                             "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                             "accept": "application/json"
                         }
                  };
                  console.log(query);
                  result=Meteor.http.post(endpointURI, options);


                    break;
               default:
               try{
                 result= HTTP.post(endpointURI,
                   {
                       'params':
                               {
                                   'default-graph-uri': defaultGraph,
                                   'query': query,
                                   'format': format,
                                   'timeout': timeout
                               }
                   });
                 }catch(e)
                 {
                    try{

                      var options = {
                             params: {
                                "query": query,
                                "output": "json"
                             },
                             headers: {
                                 "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                 "accept": "application/json"
                             }
                      };
                      result=Meteor.http.post(endpointURI, options);
                    }
                    catch(ee){

                    }

                  // console.log(result);
                 }








                   break;
                }

                return result;
            },
            runQueryDescr: function (endpointURI, defaultGraph, query, format, timeout, typeServer) {
                format = _.isUndefined(format) ? 'application/rdf+json' : format;
                timeout = _.isUndefined(timeout) ? '0' : timeout;
                console.log('Consulta' + endpointURI + '+' + query + '+' + format+' '+typeServer);
                // return HTTP.get(endpointURI,
                var result;

                switch(typeServer) {
                  case "Fuseki":
                      result= HTTP.post(endpointURI,
                        {
                            'params':
                                    {
                                        'default-graph-uri': defaultGraph,
                                        'query': query,
                                        'format': format,
                                        'timeout': timeout
                                    }
                        });
                        break;
                case "Apache Marmotta":
                  var options = {
                         params: {
                            "query": query,
                            "output": "json"
                         },
                         headers: {
                             "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                             "accept": "application/json"
                         }
                  };
                  result=Meteor.http.post(endpointURI, options);


                    break;
               default:
               try{
                 result= HTTP.post(endpointURI,
                   {
                       'params':
                               {
                                   'default-graph-uri': defaultGraph,
                                   'query': query,
                                   'format': format,
                                   'timeout': timeout
                               }
                   });
                 }catch(e)
                 {
                    try{

                      var options = {
                             params: {
                                "query": query,
                                "output": "json"
                             },
                             headers: {
                                 "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                 "accept": "application/json"
                             }
                      };
                      result=Meteor.http.post(endpointURI, options);
                    }
                    catch(ee){

                    }
                 }

                   break;
                }


                return result;
            },
            pingServer: function (endpointURI, defaultGraph, typeServer) {
                var response = {};
                try {
                    var result = Meteor.call('runQuery', endpointURI, '', 'ask {graph <' + defaultGraph + '> {?s ?p ?o}}', undefined, 10000,typeServer);
                    console.log("PingServer: "+result);

                    var content = EJSON.parse(result.content);
                    response.statusCode = result.statusCode;
                    if (result.statusCode != 200) {
                        response.msg = "Error trying to communicate with endpoint " + endpointURI;
                    } else if (result.statusCode == 200 && content.boolean == true) {
                        response.msg = '';
                    } else if (result.statusCode == 200 && content.boolean == false) {
                        response.statusCode = 404;
                        response.msg = "Graph <" + defaultGraph + "> does not exists on endpoint " + endpointURI;
                    }
                } catch (e) {
                    response.statusCode = 500;
                    response.msg = "Error trying to communicate with endpoint " + endpointURI;
                    response.stack = e.stack;
                }

                return response;
            },
            findendpointactual: function (resource) {

                var response = {};
                response.endpoint = {};
                response.content = false;
                console.log('!!!!!!!!!!!!!!EntraEndpoint');
                var endpointsArray = Endpoints.find().fetch();
                console.log(endpointsArray);
                for (var i = 0; i < endpointsArray.length; i++) {
                    console.log('EndpointServer');
                    console.log(endpointsArray[i]);
                    var graph = endpointsArray[i].graphURI;
                    var endpoint = endpointsArray[i].endpoint;
                    try {
                        var result = Meteor.call('runQuery', endpoint, '', 'ASK { graph   <' + graph + '> { <' + resource + '> ?a ?b } }', undefined, 10000,endpointsArray[i].typeServer);
                        var content = EJSON.parse(result.content);
                        response.statusCode = result.statusCode;
                        if (result.statusCode != 200) {
                            response.msg = "Error trying to communicate with endpoint " + endpoint;
                        } else if (result.statusCode == 200 && content.boolean == true) {
                            response.msg = '';
                            response.endpoint = endpointsArray[i];
                            response.content = true;
                            return response;
                            i = endpointsArray.length;
                        } else if (result.statusCode == 200 && content.boolean == false) {
                            response.statusCode = 404;
                            response.msg = "Graph <" + defaultGraph + "> does not exists on endpoint " + endpoint;
                        }
                    } catch (e) {
                        response.statusCode = 500;
                        response.msg = "Error trying to communicate with endpoint " + endpoint;
                        //response.stack = e.stack;
                    }



                }
                return response;
            },
            getSuggestions: function (text, clas_, lsend) {
                this.unblock();
                if (text == null || lsend != null && lsend.length == 0) {
                    return {data: [], cacheable: true};
                }
                var text2 = text.removeDiacritics().keyword().trim().toLowerCase().replace(/[\.\+\/\\\|\*`\~,!@\#$%:^&\(\)\[\]\{\}\?\<\>\;=\'\"´-]+/g, " ");
                if (text2 === "") {
                    return {data: [], cacheable: true};
                }
                var strend = '';
                if (lsend != null) {
                    for (var g = 0; g < lsend.length; g++) {
                        strend += lsend[g] + "__";
                    }
                } else {
                    strend = "ALL__";
                }
                var words = text2.split(" ").filter(function (d) {
                    return d !== "";
                });
                for (var i = 0; i < words.length; i++) {
                    if (i == words.length - 1) {
                        words[i] = "(" + words[i] + "* OR " + words[i] + "~ OR " + words[i] + ")";
                    } else {
                        words[i] = "(" + words[i] + "~ OR " + words[i] + ")";
                    }
                }
                words.sort();
                var query = "";
                for (var i = 0; i < words.length; i++) {
                    query += words[i];
                    if (i != words.length - 1) {
                        query += " AND ";
                    }
                }
                query = "(" + query + ")";
                var txtcach = query + clas_ + strend;
                var txtcachhsh = txtcach.hashCode();
                var rca = Cache.find({keyl: txtcachhsh}).fetch();
                if (rca.length > 0) {
                    //console.log('cache');
                    rca = rca[0];
                    return {data: rca.value, cacheable: rca.cacheable};
                } else {
                    rca = Cache.find({queue: txtcachhsh}).fetch();
                    if (rca.length == 0) {
                        //console.log('envio cache');
                        num_auto = (num_auto > 10000) ? 0 : num_auto + 1;
                        Cache.insert({queue: txtcachhsh, qord: num_auto, cont: 0, resp: [], query: query, clas_: clas_, lsend: lsend});
                    }
                    for (var w = 0; w < 10; w++) {
                        rca = Cache.find({keyl: txtcachhsh}).fetch();
                        if (rca.length > 0) {
                            rca = rca[0];
                            if (rca.value.length > 0) {
                                return {data: rca.value, cacheable: rca.cacheable};
                            }

                        }
                        Meteor._sleepForMs(500);
                    }

                }

                return {data: [], cacheable: false};
            }
            ,
            findPrefix: function (URIMap) {
                var idx = URIMap.lastIndexOf('#') > 0 ? URIMap.lastIndexOf('#') : URIMap.lastIndexOf('/');
                var uri = URIMap.substring(0, idx + 1);
                var response = {};
                var Prefix = Prefixes.findOne({URI: uri});
                response.prefix = _.isUndefined(Prefix) ? '' : Prefix.prefix;
                response.property = URIMap.substring(idx + 1);
                return response;
            },
            fetchGraphSchema: function (endpointURI, defaultGraph,typeServer) {
                var muestra;

                console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');
                var result = Meteor.call('runQuery', endpointURI, defaultGraph,
                        'select distinct ?o where{ ?s a ?o . '
                        + 'BIND(STR(?s) AS ?strVal) '
                        + 'FILTER(STRLEN(?strVal) >= ' + defaultGraph.length + ' && SUBSTR(?strVal, 1, ' + defaultGraph.length + ' ) = "'
                        + defaultGraph + '")}', undefined,undefined,typeServer
                        );
                var rsEntities = EJSON.parse(result.content);

                var dataset = [];
                var datasetRDF = {};
                _.each(rsEntities.results.bindings, function (el, idx, list) {
                    var subject = el.o.value;
                    console.log('=>Obtaining subject properties of: ' + subject);
                    var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph,
                            'select distinct ?s where{ ?s a <' + subject + '>} limit 10', undefined,undefined,typeServer);

                    var rsMuestra = EJSON.parse(rsMuestra.content);


                    var predicateArray = {};
                    _.each(rsMuestra.results.bindings, function (el, idx, list) {
                        var entity = el.s.value;
                        console.log('==>Graph Entity sample: ' + entity);
                        var rsPredicate = Meteor.call('runQueryDescr', endpointURI, defaultGraph, 'describe <' + entity + '>',undefined,undefined, typeServer);
                        //Cambios
                        rsPredicate = EJSON.parse(rsPredicate.content);
                        _.each(rsPredicate, function (el, idx, list) {

                            var Suj = new Object();
                            Suj = el;
                            var s = idx;
                            console.log('Este Sujeto:' + idx);
                            //if(el.s.value == entity) { //just process entity own properties
                            //	console.log ('Ob '+list[idx]+el+el.value);
                            //		var result = '';
                            //		var result2 = '';
                            //	for (var i in list) {
                            //	 if (list.hasOwnProperty(i)) {
                            //		  result = 'lista' + "." + i + " = " + list[i] + "\n";
                            //		  console.log ('Lista'+result);
                            //		  var Obj = new Object();
                            //		  	Obj = list[i];
                            //		  for (var l in Obj) {
                            //		  	result2 = l;
                            //		  	console.log ('I'+result2+'val'+Obj[l]+'-'+Obj[l].value+'/'+Obj[l].type);
                            //		  	var Obj2 = new Object();
                            //		  	Obj2 = Obj[l];
                            //		  	 for (var m in Obj2) {
                            //		  	 	console.log ('Obj2'+'-'+m+'*'+Obj2[m].value+'/'+Obj2[m].type);


                            //		  	 }

                            //		  }
                            // console.log ('I'+result2+'val'+Obj[l]+'-'+Obj[l].value+'/'+Obj[l].type);

                            //	}}


                            if (idx == entity) {
                                var Obj2 = new Object
                                console.log("Ini" + entity);
                                _.each(Suj, function (el, idx, list) {
                                    // 	console.log ('Valor'+idx + 'val'+list[idx]+el.value+el[0].value+'*'+el[0].type);


                                    var p = idx;
                                    var o = el[0];
                                    console.log('Sujeto' + s + 'Predicado' + p + 'Objeto' + o.value + '!' + o.type);
                                    //  _.each (Suj,function(el, idx, list) {

                                    //	console.log ('Valor'+idx + 'val'+list[idx]+el.value+el[0].value+'*'+el[0].type);
                                    //  });

                                    //just process entity own properties
                                    //console.log('Predicate:' + el);
                                    //	var sujetos = list ;
                                    //		_.each(sujetos, function(el, idx, list) {
                                    //			console.log ('valor'+idx+el+el.valor+list[0]);
                                    //		});

                                    ////////////////////
                                    var predicateObj = {};
                                    //	predicateObj.fullName = el.p.value;
                                    predicateObj.fullName = p;
                                    predicateObj.prefix = '';
                                    predicateObj.name = '';
                                    /////////////////////

                                    if (p == "http://rdaregistry.info/Elements/a/P50161") {
                                        console.log('*******sujeto: ' + entity + '******');
                                    }

                                    if (_.isUndefined(predicateArray[p])) {
                                        var objectObj = {};
                                        objectObj.objectEntity = {};
                                        objectObj.dataType = o.datatype;
                                        objectObj.sampleValue = isNaN(o.value) ? o.value.substring(0, 100) : o.value;
                                        if (o.type === 'uri' && subject != o.value) {

                                            console.log('==>Looking entity type for object <' + o.value + '>');
                                            var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph,
                                                    'select ?o where { <' + o.value + '> a ?o }',undefined,undefined,typeServer);
                                            rsObjSubject = EJSON.parse(rsObjSubject.content);
                                            objectObj.objectEntity.fullName = null;
                                            objectObj.objectEntity.prefix = null;
                                            objectObj.objectEntity.name = null;
                                            //if found results
                                            if (rsObjSubject.results.bindings.length > 0) {
                                                var objectURI = rsObjSubject.results.bindings[0].o.value;
                                                var responsePrefix = Meteor.call('findPrefix', objectURI);
                                                objectObj.objectEntity.fullName = objectURI;
                                                objectObj.objectEntity.prefix = responsePrefix.prefix;
                                                objectObj.objectEntity.name = responsePrefix.property;
                                            }
                                        }
                                        predicateArray[p] = objectObj;
                                    }


                                    muestra = predicateArray;
                                    //muestra = {subjectObj: subject, predicate: predicateObj, objectP: objectObj};
                                    //console.log('===>Subject: ' + subject + '| Predicate:' + el.p.value + '| Object:' + object + '| Type:' + type + '| Datatype:' + datatype);
                                    /*
                                     console.log('===>Subject: ' + subject + '| Predicate:' + predicateObj.fullName
                                     + '| Object:' + (objectObj.objectEntity||objectObj.dataType) + '| SampleValue:' + objectObj.sampleValue);
                                     */

                                });
                            }

                        });
                    });
                    var aux = {};
                    var cont = 0;
                    for (var predicate in predicateArray) {
                        cont++;
                        var responsePrefix = Meteor.call('findPrefix', predicate);
                        /*var idx = predicate.lastIndexOf('#') > 0 ? predicate.lastIndexOf('#'): predicate.lastIndexOf('/');
                         var uri = predicate.substring(0, idx+1);
                         var property = predicate.substring(idx+1);
                         var Prefix = Prefixes.findOne({URI: uri});
                         Prefix.prefix = _.isUndefined(Prefix) ? '': Prefix.prefix;
                         */
                        var objectObj = predicateArray[predicate];
                        var subjectPrefix = Meteor.call('findPrefix', subject);
                        var register = {
                            endpoint: endpointURI,
                            graphURI: defaultGraph,
                            subject: {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property},
                            predicate: {fullName: predicate, prefix: responsePrefix.prefix, name: responsePrefix.property},
                            objectType: objectObj
                        };
                        Graphs.insert(register);
                        dataset.push(register);
                        /*Graphs.insert(
                         {
                         endpoint: endpointURI,
                         graphURI: defaultGraph,
                         subject: {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property },
                         predicate: { fullName: predicate, prefix: responsePrefix.prefix, name: responsePrefix.property},
                         objectType: objectObj
                         }
                         );*/



                        console.log('===>SAVED: Subject: ' + subject + ' prefix: ' + subjectPrefix.prefix + ' property: ' + subjectPrefix.property
                                + '| Predicate:' + predicate + ' prefix: ' + responsePrefix.prefix + ' property: ' + responsePrefix.property
                                + '| Object:'
                                + (_.isUndefined(objectObj.objectEntity.fullName) ? '' : (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name))
                                + (objectObj.dataType ? objectObj.dataType : '')
                                + '| SampleValue:' + objectObj.sampleValue);
                        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
                        if (_.isUndefined(datasetRDF[predicate])) {
                            datasetRDF[predicate] = {};
                            datasetRDF[predicate].endpoint = endpointURI;
                            datasetRDF[predicate].graphURI = defaultGraph;
                            datasetRDF[predicate].fullName = predicate;
                            datasetRDF[predicate].prefix = responsePrefix.prefix;
                            datasetRDF[predicate].name = responsePrefix.property;
                            datasetRDF[predicate].subjects = [];
                            datasetRDF[predicate].objectTypes = [];
                        }
                        datasetRDF[predicate].subjects.push(subjectItem);
                        datasetRDF[predicate].objectTypes.push(objectObj);
                    }
                    //processing group by predicate registers model
                    /*
                     var arrays = {};
                     c = _.groupBy(dataset, function(obj){return obj.predicate.fullName;});
                     var counter = 0;
                     for(property in c) {
                     d = c[property];
                     e = _.uniq(d, false, function(obj){return obj.subject.fullName + '-' + obj.objectType.objectEntity.fullName;});
                     f = _.pluck(e, 'subject');
                     g = _.pluck(e, 'objectType');
                     g = _.uniq(g, false, function(obj){return obj.dataType;});
                     propertyItem = {};
                     propertyItem.allowedEntities = f;
                     propertyItem.dataType = g;
                     arrays[property] = propertyItem;
                     Graphs2.insert({
                     predicate: property, description: propertyItem
                     });
                     counter++;
                     }
                     console.log('==> prueba ' + counter + ' ' + arrays['http://id.loc.gov/vocabulary/relators/aut']);
                     */
                });
                var cont = 0;
                var str = '';
                for (var x in datasetRDF) {
                    //console.log(datasetRDF[x]);
                    Properties.insert(datasetRDF[x]);
                    str = str + '||' + x;
                    cont++;
                }
                console.log('==> contador == : ' + cont);
                console.log('==> predicados == : ' + str);
                return muestra;
            },
            fetchGraphSchema2: function (endpointURI, defaultGraph) {
                console.log('ENtra 2')
                console.log('==Obtaining graph description of <' + defaultGraph + '> from ' + endpointURI + '==');
                var result = Meteor.call('runQuery', endpointURI, defaultGraph, 'select distinct ?o where{ ?s a ?o}');
                var rsEntities = EJSON.parse(result.content);
                var dataset = [];
                var datasetRDF = {};
                ///Cambios JS
                _.each(rsEntities.results.bindings, function (el, idx, list) {
                    var subject = el.o.value;
                    console.log('=>Obtaining subject properties of: ' + subject);
                    var rsMuestra = Meteor.call('runQuery', endpointURI, defaultGraph,
                            'select distinct ?s where{ ?s a <' + subject + '>} limit 5');
                    var rsMuestra = EJSON.parse(rsMuestra.content);
                    var predicateArray = {};
                    _.each(rsMuestra.results.bindings, function (el, idx, list) {
                        var entity = el.s.value;
                        console.log('==>Graph Entity sample: ' + entity);
                        var rsPredicate = Meteor.call('runQuery', endpointURI, defaultGraph, 'describe <' + entity + '>');
                        rsPredicate = EJSON.parse(rsPredicate.content);
                        _.each(rsPredicate.results.bindings, function (el, idx, list) {
                            console.log('-****Predicate: ' + el.p.value);
                            ////////////////////
                            var predicateObj = {};
                            predicateObj.fullName = el.p.value;
                            predicateObj.prefix = '';
                            predicateObj.name = '';
                            /////////////////////

                            if (_.isUndefined(predicateArray[el.p.value])) {
                                var objectObj = {};
                                objectObj.objectEntity = {};
                                objectObj.dataType = el.o.datatype;
                                objectObj.sampleValue = isNaN(el.o.value) ? el.o.value.substring(0, 100) : el.o.value;
                                if (el.o.type === 'uri' && subject != el.o.value) {

                                    console.log('==>Looking entity type for object <' + el.o.value + '>');
                                    var rsObjSubject = Meteor.call('runQuery', endpointURI, defaultGraph,
                                            'select ?o where { <' + el.o.value + '> a ?o }');
                                    rsObjSubject = EJSON.parse(rsObjSubject.content);
                                    objectObj.objectEntity.fullName = null;
                                    objectObj.objectEntity.prefix = null;
                                    objectObj.objectEntity.name = null;
                                    //if found results
                                    if (rsObjSubject.results.bindings.length > 0) {
                                        var objectURI = rsObjSubject.results.bindings[0].o.value;
                                        var responsePrefix = Meteor.call('findPrefix', objectURI);
                                        objectObj.objectEntity.fullName = objectURI;
                                        objectObj.objectEntity.prefix = responsePrefix.prefix;
                                        objectObj.objectEntity.name = responsePrefix.property;
                                    }
                                }
                                predicateArray[el.p.value] = objectObj;
                            }
                            //muestra = {subjectObj: subject, predicate: predicateObj, objectP: objectObj};
                            //console.log('===>Subject: ' + subject + '| Predicate:' + el.p.value + '| Object:' + object + '| Type:' + type + '| Datatype:' + datatype);
                            /*
                             console.log('===>Subject: ' + subject + '| Predicate:' + predicateObj.fullName
                             + '| Object:' + (objectObj.objectEntity||objectObj.dataType) + '| SampleValue:' + objectObj.sampleValue);
                             */

                        });
                    });
                    var aux = {};
                    var cont = 0;
                    var currentRegId = null;
                    for (var predicate in predicateArray) {
                        cont++;
                        var responsePrefix = Meteor.call('findPrefix', predicate);
                        var objectObj = predicateArray[predicate];
                        var subjectPrefix = Meteor.call('findPrefix', subject);
                        console.log('===>SAVED: Subject: ' + subject + ' prefix: ' + subjectPrefix.prefix + ' property: ' + subjectPrefix.property
                                + '| Predicate:' + predicate + ' prefix: ' + responsePrefix.prefix + ' property: ' + responsePrefix.property
                                + '| Object:'
                                + (_.isUndefined(objectObj.objectEntity.fullName) ? '' : (objectObj.objectEntity.fullName + ' prefix: ' + objectObj.objectEntity.prefix + ' property: ' + objectObj.objectEntity.name))
                                + (objectObj.dataType ? objectObj.dataType : '')
                                + '| SampleValue:' + objectObj.sampleValue);
                        var subjectItem = {fullName: subject, prefix: subjectPrefix.prefix, name: subjectPrefix.property};
                        if (_.isUndefined(datasetRDF[predicate])) {
                            datasetRDF[predicate] = {};
                            datasetRDF[predicate].endpoint = endpointURI;
                            datasetRDF[predicate].graphURI = defaultGraph;
                            datasetRDF[predicate].fullName = predicate;
                            datasetRDF[predicate].prefix = responsePrefix.prefix;
                            datasetRDF[predicate].name = responsePrefix.property;
                            datasetRDF[predicate].subjects = [];
                            datasetRDF[predicate].objectTypes = [];
                            //first insertion
                            currentRegId = Properties.insert(datasetRDF[predicate]);
                        }
                        datasetRDF[predicate].subjects.push(subjectItem);
                        datasetRDF[predicate].objectTypes.push(objectObj);
                        Properties.update({_id: currentRegId}, {$set:
                                    {subjects: datasetRDF[predicate].subjects,
                                        objectTypes: datasetRDF[predicate].objectTypes
                                    }
                        });
                    }
                    //processing group by predicate registers model
                    /*
                     var arrays = {};
                     c = _.groupBy(dataset, function(obj){return obj.predicate.fullName;});
                     var counter = 0;
                     for(property in c) {
                     d = c[property];
                     e = _.uniq(d, false, function(obj){return obj.subject.fullName + '-' + obj.objectType.objectEntity.fullName;});
                     f = _.pluck(e, 'subject');
                     g = _.pluck(e, 'objectType');
                     g = _.uniq(g, false, function(obj){return obj.dataType;});
                     propertyItem = {};
                     propertyItem.allowedEntities = f;
                     propertyItem.dataType = g;
                     arrays[property] = propertyItem;
                     Graphs2.insert({
                     predicate: property, description: propertyItem
                     });
                     counter++;
                     }
                     console.log('==> prueba ' + counter + ' ' + arrays['http://id.loc.gov/vocabulary/relators/aut']);
                     */
                });
            },
            getEndpointStructure: function (graphName, endpointURI, defaultGraph, graphDescription, colorId, baseEndpoint, updateGraph, optional, typeServer) {

                String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };

                defaultGraph=defaultGraph.trim();
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});

                var response = Meteor.call('pingServer', endpointURI, defaultGraph, typeServer);
                if (response.statusCode != 200 || response.msg.length > 0)
                    return response;
                var statusCode = response.msg.length == 0 ? 'A' : 'I';
                if (baseEndpoint) {
                    Endpoints.update({base: true}, {$set: {base: false}}, {multi: true});
                }
                if (_.isUndefined(endpoint)) {
                    console.log('==Inserting new endpoint');
                    var color_id = colorId ? colorId : '#' + Math.floor(Math.random() * 16777215).toString(16);
                    Endpoints.insert({name: graphName, colorid: color_id, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg, opt: optional, typeServer: typeServer});
                    //updateGraph = true;
                } else {
                    console.log('==Updating endpoint ' + endpointURI + '<' + defaultGraph + '>'+typeServer);
                    Endpoints.update({_id: endpoint._id}, {$set: {name: graphName, colorid: colorId, endpoint: endpointURI, graphURI: defaultGraph, description: graphDescription, base: baseEndpoint, status: statusCode, lastMsg: response.msg, opt: optional, typeServer: typeServer}});
                }
                if (updateGraph) {
                    Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
                    Meteor.call('fetchGraphSchema', endpointURI, defaultGraph, typeServer, function (error, result) {
                        if (error) {
                            console.log("Error ==>" + error);
                            response.statusCode = 500;
                            response.stack = error;
                        } else {
                            console.log("Graph Schema fetching process finished for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
                        }
                    });
                } else {
                    console.log("Skipping Graph Schema fetching process for endpoint: " + endpointURI + ' <' + defaultGraph + '>');
                }
                Meteor.call('updateStats');
                return response;
            },
            updateBaseEndpoint: function (endpointURI, defaultGraph) {
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                Endpoints.update({base: true}, {$set: {base: false}}, {multi: true});
                //Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
                Endpoints.update({_id: endpoint._id}, {$set: {base: true, opt: false}});
                console.log("==NEW endpoint base: " + endpointURI + " - " + defaultGraph);
            },
            deleteEndpoint: function (id, endpointURI, defaultGraph) {
                Properties.remove({endpoint: endpointURI, graphURI: defaultGraph});
                Endpoints.remove(id);
                console.log("==Endpoint removed: " + endpointURI + " - " + defaultGraph);
                Meteor.call('updateStats');
            },
            updateOptEndpoint: function (endpointURI, defaultGraph, optional) {
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                //	Endpoints.update({base: true},{$set: {base: false}},{multi: true});
                //Endpoints.update({_id: endpoint._id}, {$set: {base: true}});
                Endpoints.update({_id: endpoint._id}, {$set: {opt: optional}});
                console.log("==OPtional endpoint opt: " + endpointURI + " - " + defaultGraph + " Opt" + optional);
            },
            findoptional: function (endpointURI, defaultGraph) {
                console.log(endpointURI + defaultGraph);
                var endpoint = Endpoints.findOne({endpoint: endpointURI, graphURI: defaultGraph});
                console.log("Resp" + endpoint.opt);
                return endpoint.opt;
            },
            findbase: function () {
                // console.log(endpointURI + defaultGraph);
                var endpoint = Endpoints.findOne({base: true});
                // console.log("Resp" + endpoint.opt);
                return endpoint;
            },
            findAllEndpoints: function () {
                // console.log(endpointURI + defaultGraph);
                var endpoint = Endpoints.find().fetch();
                // console.log("Resp" + endpoint.opt);
                return endpoint;
            }
            ,
            findProfile: function (id) {
        // console.log(endpointURI + defaultGraph);
                var profile = Profile.findOne({idProfile: id});
                // console.log("Resp" + endpoint.opt);
                //   console.log ("Perfil");
                //   console.log (profile);

                /*

                 if (!_.isUndefined(profile)) {
                 return profile;
                 }else {

                 return profile;var profilenull;

                 }*/
                return profile;
            }, SaveProfile: function (id, name, dir, level, area, lan, pass, mail, access) {
                var profile = Profile.findOne({idProfile: id});
                /* console.log ("Perfil");
                 console.log (profile);*/
                var obj = {idProfile: id, nameUser: name, direction: dir, levelAcademic: level, areasInterest: area, language: lan, password: pass, secMail: mail, accessLevel: access};
                //   console.log (check(obj, ProfileSchema));
                var isValid = Match.test(obj, ProfileSchema);
                //   console.log ("Validado");
                //    console.log (isValid);
                // check({admin: true}, mySchema);

                if (this.userId == id && isValid) {
                    if (!_.isUndefined(profile)) {

                        /*   console.log ("Almacenando");
                         console.log (Meteor.users.findOne({_id:id}));
                         console.log (access);*/
                        Meteor.users.update({_id: id}, {$set: {"profile": {lang: lan, 'access': access}}});
                        //Meteor.users.update({_id:id}, {$set:{"profile": {lang: lan} , "accessLevel": {"access":access}}});
                        console.log(Meteor.users.findOne({_id: id}));
                        Profile.update({idProfile: id}, {$set: {nameUser: name, direction: dir, levelAcademic: level, areasInterest: area, language: lan, password: pass, secMail: mail, accessLevel: access}});
                        return "Actualizado";
                    } else {
        //Meteor.users.update({_id:id}, {$set:{"profile": {lang: lan} , "accessLevel": {"access":access}}});
                        Meteor.users.update({_id: id}, {$set: {"profile": {lang: lan, 'access': access}}});
                        Profile.insert({idProfile: id, nameUser: name, direction: dir, levelAcademic: level, areasInterest: area, language: lan, password: pass, secMail: mail, accessLevel: access});
                        return "Almacenado";
                    }
                } else {
                    return "No es posible realizar cambios";
                }

            }, actAccess: function (usercode, val) {


                var obj = {idProfile: usercode, accessLevel: val};
                var isValid = Match.test(obj, UpdateProfileSchema);
                //    console.log ("Val Access");
                //    console.log (isValid);
                //     console.log (check(obj, UpdateProfileSchema));
                //   console.log (valAccess (this.userId, 2));

                if (valAccess(this.userId, 2) && isValid) {

                    var usuario = Meteor.users.findOne({'_id': usercode});
                    var profile = Profile.findOne({'idProfile': usercode});
                    //  console.log ("Profile");
                    //  console.log (profile);
                    //   console.log (usuario);                    {$set:{"profile": {lang: usuario.profile.lang } , "accessLevel": {"access":val}}});
                    //   Meteor.users.update ({'_id' : usercode}, {$set: { "profile" :[  { lang: usuario.profile.lang } , { access: val } ]   }});
                    Meteor.users.update({'_id': usercode}, {$set: {"profile": {lang: profile.language, access: val}}});
                    //  Meteor.users.update ({'_id' : usercode}, {$set:{"profile": {lang: usuario.profile.lang } , "accessLevel": {"access":val}}});
                    Profile.update({idProfile: usercode}, {$set: {accessLevel: val}});
                    return "Actualizado";
                } else {
                    return "No se puede Actualizar";
                }
            }, validar: function (opt) {
                var usr = Meteor.users.findOne({'_id': this.userId});
                //   console.log ("Usuario");

                //if (!_.isUndefined(usr) && usr.profile[1].access > 1 ){
                if (!_.isUndefined(usr) && ((usr.profile.access > 1 && opt == 1) || (usr.profile.access > 0 && opt == 0)))
                {
                    return true;
                } else {
                    return false;
                }



            }, deleteuser: function (id) {
        //  console.log ("delete"+id);
                if (valAccess(this.userId, 2)) {
                    Profile.remove({'idProfile': id});
                    Meteor.users.remove({'_id': id});
                    return "Usuario Borrado";
                } else {
                    return "Usuario no puede ser borrado";
                }

            }, savesearch: function (searchw, source, filters) {
                var d = new Date();
                // var dateactual = d.toLocaleString();
                Searchs.insert({idUser: this.userId, searchword: searchw, sources: source, searchfilters: filters, timeaction: d});
                return "Almacenado";
            },
            savefavresource: function (uriresource, label) {
                var time = Date();
                var Fav = Favresources.findOne({'idUser': this.userId, 'urifav': uriresource});
                if (_.isUndefined(Fav)) {
                    Favresources.insert({idUser: this.userId, urifav: uriresource, labelres: label, timeaction: time});
                } else {
                    Favresources.remove({'idUser': this.userId, 'urifav': uriresource});
                }
                return "Almacenado";
            }, DeleteHist: function (idsearch) {
                Searchs.remove({'idUser': this.userId, '_id': idsearch});
                console.log(idsearch);
                return "Eliminado";
            }, Deletefav: function (idfav) {
                Favresources.remove({'idUser': this.userId, '_id': idfav});
                return "Eliminado";
            },saveinterest: function  (URI) {
                 var interest = InterestResources.findOne({ 'idUser': this.userId , 'URI' : URI });

                   if (  _.isUndefined(interest)){

                 InterestResources.insert({idUser: this.userId , 'URI' : URI });
                 return "almacenado";
                 }

                 return "Ya estaba almacenado";

              } ,

              RecomendationItems: function  () {
                 var reco = Recomendation.find({ 'userid': this.userId }).fetch();

                   if ( !_.isUndefined(reco)){
                 //console.log (reco);
                // InterestResources.insert({idUser: this.userId , 'URI' : URI });
                 return reco;
                 }

                 return "Error";

              }



        });

        //Update Prefixes schema on every server startup
        //Meteor.call('updatePrefixes');
        SyncedCron.start();

    });
}
