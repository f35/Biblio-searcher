/*
 View logic for the query samples list component
 */
function AndStr(str) {
    var sp = str.trim().split(' ').filter(function (d) {
        return d !== "";
    });
    var rs = '';
    for (var n = 0; n < sp.length; n++) {
        rs += sp[n] + ((n == sp.length - 1) ? '' : ' AND ');
    }
    return rs;
}

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

String.prototype.clearWords = function () {
    var terms = this;
    var text2 = terms.trim().toLowerCase().replace(/[\.\+\/\\\|\*`\~,!@\#$%:^&\(\)\[\]\{\}\?\<\>\;=\'\"´-]+/g, " ");
    var words = text2.split(" ").filter(function (d) {
        return d !== "";
    });
    words = words.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
    words.sort();
    var query = "";
    for (var i = 0; i < words.length; i++) {
        query += words[i];
        if (i != words.length - 1) {
            query += " ";
        }
    }
    return query;

}



this.SearchView = Backbone.View.extend({
    tagName: "div",
    id: "search",
    /////////////////////////
    // View Initialization //
    /////////////////////////
    initialize: function (s1, s2, s3) {
        var me;
        me = this;
        Session.set('s1', s1);
        Session.set('s2', s2);
        Session.set('s3', s3);

    },
    //////////////////////////
    //Render Samples Views//
    //////////////////////////
    render: function () {
        Blaze.render(Template.search, $('#sparql-content')[0]);
        this.setEvents($('#sparql-content'));


        console.log('render search');
        //  console.log (Session.get ('welcome'));
        console.log("fin");
        //Session.get('v1');


        return this;
    },
    // setEvents: function (divNode) {
    setEvents: function (divNode) {
        var FromList = [];
        Session.set('DespSug', true);
        Session.set('DespFac', true);

        $("#pfac").css("min-height", "40px");
        $("#sug").collapse('show');
        $("#fac").collapse('show');

        var term = Session.get('s1');
        var type = Session.get('s2');
        var base = Session.get('s3')
        /*
         *
         *
         *
         *
         *
         $(".imgfav").click(function (){
         //$(".change").removeClass("selected");
         alert ("click");
         $(this).attr ("src","/images/starblue.png");
         });*/


        //      alert (term);
        //$('input:radio[data-name='+base+']').prop("checked", "checked");
        //alert($('input:radio[data-name='+base+']'));
        //console.log($('input:radio[data-name='+base+']'));
        //  $('input:radio[data-name='+base+']').prop("checked", "checked");
        // var FromList = get_checkList_values("repositoriesList");
        //console.log($('input[data-name='+base+']'));
        //console.log (FromList);

        function get_radio_value(RadioName) {
            var inputs = document.getElementsByName(RadioName);
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].checked) {
                    return inputs[i].value;
                }
            }
        }

        function get_checkList_values2(CheckName) {
            var inputs = document.getElementsByName(CheckName);
            var values = [];
            for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].checked) {
                    values.push(i);
                }
            }
            return values;
        }


        var cache = {};
        var actu = {};
        var strend = '';


        //try{
        $("#mce-text").autocomplete({
            minLength: 3,
            source: function (request, response) {

                var strend2 = '';
                var lsend = get_checkList_values2('repositoriesList');
                for (var g = 0; g < lsend.length; g++) {
                    strend2 += lsend[g] + "__";
                }

                if (strend !== strend2) {
                    cache = {};
                    actu = {};
                    strend = strend2;
                }


                var term = request.term;
                if (term in cache) {
                    if (cache[ term ].length > 0) {
                        response(cache[ term ]);
                    }
                    if (term in actu) {

                        actu[term] = undefined;
                        cache[term] = undefined;
                    } else {
                        return;
                    }
                }

                var t__ = "T";
                var EntitySearch = get_radio_value("opciones");
                switch (EntitySearch) {
                    case 'autores':
                        t__ = "P";
                        break;
                    case 'documentos':
                        t__ = "D";
                        break;
                    case 'colecciones':
                        t__ = "C";
                        break;
                }
                if (term != null && term.trim().length > 3) {

                    //Meteor.call('getSuggestions', term, t__, false, get_checkList_values2('repositoriesList'), function (error, result) {
                    // });
                    Meteor.call('getSuggestions', term, t__, get_checkList_values2('repositoriesList'), function (error, result) {
                        //console.log(result);
                        try {
                            cache[ term ] = result.data;
                            if (!result.cacheable) {
                                actu[ term ] = true;
                            }
                            if (result.data.length > 0) {
                                response(result.data);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }


            }
        });
        //}catch(e){
        //    console.log(e);

        //  }

        //$('#ui-id-1').css('text-align: center;');






        var prev;
        $("#documentos2").click(function () {
            cache = {};
            actu = {};
            var val = 'documentos';
            prev = selec2(prev, val);

        });

        $("#autores2").click(function () {
            cache = {};
            actu = {};
            var val = 'autores';
            prev = selec2(prev, val);
            console.log($('input[data-name=' + base + ']'));
        });

        $("#colecciones2").click(function () {
            cache = {};
            actu = {};
            var val = 'colecciones';
            prev = selec2(prev, val);
        });

        $('#AllRepo').on('click', function (ev) {
            if (document.getElementsByName('repositoriesListAll')[0].checked) {
                var inputs = document.getElementsByName('repositoriesList');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = true;
                    inputs[i].disabled = true;
                }
            } else {
                var inputs = document.getElementsByName('repositoriesList');
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = false;
                }
            }

        });





        $('input.runSearch').on('click', function (ev) {

            //Session.set("auxAct", Session.get("auxAct") + 1);
            //App.resultCollection2.remove({});
            //var EntitySearch = get_radio_value("resourceType");


            var EntitySearch = get_radio_value("opciones");

            var FromListaux = get_checkList_values("repositoriesList");
            if (FromListaux.length > 0) {

                FromList = FromListaux;
                console.log(FromListaux);

            }

            var TextSearch = $("input.textToSearch").val().clearWords();
            var originTextSearch = $("input.textToSearch").val();
            // alert(FromList);
            // console.log($('input[data-name='+base+']'));
            //console.log("Radio");
            // console.log(EntitySearch);
            // console.log("check");
            // console.log(FromList);
            // console.log("text");
            //  console.log(TextSearch);


            var ResultLimit = ''; //limit 100
            var DocSearchRequest = {};
            DocSearchRequest.resourceClass = 'http://purl.org/ontology/bibo/Document';
            DocSearchRequest.indexProperties = ['http://purl.org/ontology/bibo/abstract', 'http://purl.org/dc/terms/title', 'http://purl.org/dc/terms/subject'];
            DocSearchRequest.indexPropertiesName = ['Abstract', 'Title', 'Subject'];
            DocSearchRequest.labelProperty = 'http://purl.org/dc/terms/title';

            var AuthSearchRequest = {};

            AuthSearchRequest.resourceClass = 'http://xmlns.com/foaf/0.1/Person';
            AuthSearchRequest.indexProperties = ['http://xmlns.com/foaf/0.1/name'];
            AuthSearchRequest.indexPropertiesName = ['Name'];
            AuthSearchRequest.labelProperty = 'http://xmlns.com/foaf/0.1/name';

            var ColSearchRequest = {};

            ColSearchRequest.resourceClass = 'http://purl.org/ontology/bibo/Collection';
            ColSearchRequest.indexProperties = ['http://purl.org/dc/terms/description'];
            ColSearchRequest.indexPropertiesName = ['Description'];
            ColSearchRequest.labelProperty = 'http://purl.org/dc/terms/description';

            //Session.set('Qmode2', 0);
            var AppFilt = false;

            var ResqLis = [];
            switch (EntitySearch) {

                case 'documentos':
                    {
                        ResqLis.push(DocSearchRequest);
                    }
                    break;
                case 'autores':
                    {
                        ResqLis.push(AuthSearchRequest);
                        AppFilt = true;
                    }
                    break;
                case 'colecciones':
                    {
                        ResqLis.push(ColSearchRequest);
                        AppFilt = true;
                    }
                    break;
                default:
                    {
                        ResqLis.push(DocSearchRequest);
                        ResqLis.push(AuthSearchRequest);
                        ResqLis.push(ColSearchRequest);
                    }
                    break;
            }


            //}
            var usr = Profile.findOne({idProfile: Meteor.userId()});
            var idi = 'none';
            var ty = '1';
            var int = '';
            if (usr) {
                idi = usr.language;
                if (usr.levelAcademic == 1) {
                    ty = 2;
                }
                if (usr.levelAcademic == 2) {
                    ty = 3;
                }
                if (usr.areasInterest != undefined && Array.isArray(usr.areasInterest)) {
                    var inte = usr.areasInterest;
                    for (var sd = 0; sd < inte.length; sd++) {
                        int += '(' + AndStr(lang.getDictionnary('es')['FoS_' + inte[sd]]) + ') OR ';
                        int += '(' + AndStr(lang.getDictionnary('en')['FoS_' + inte[sd]]) + ')' + ((sd != inte.length - 1) ? ' OR ' : '');
                    }
                }
            }
            if (int == '') {
                int = '_';
            }
            //

            var typeServer ='';
            var Query='prefix text:<http://jena.apache.org/text#>\n PREFIX mm: <http://marmotta.apache.org/vocabulary/sparql-functions#> \n';



            Query += 'select *  {\n';

            if (!AppFilt) {
                TextSearch = TextSearch.trim().replace(/\s+/g, ' ');

                TextSearch = TextSearch.replace(/\s/g, " AND ");
            }
            var ResultLimitSubQ = (AppFilt) ? '15' : '1000';
            var SubQN = 0;
            var sources = [];


            for (var oneQuery = 0; oneQuery < FromList.length; oneQuery++) {
                var EndpointLocal = FromList[oneQuery].attributes['data-base'] ? FromList[oneQuery].attributes['data-base'].value : false;
                var Service = FromList[oneQuery].attributes['data-endpoint'].value;
                var ServiceName = FromList[oneQuery].attributes['data-name'].value;
                var ServiceTypeServer = FromList[oneQuery].attributes['data-typeserver'].value;
                var ServiceGrapUri = FromList[oneQuery].attributes['data-graphuri'].value;

                typeServer=ServiceTypeServer;

                for (var oneRes = 0; oneRes < ResqLis.length; oneRes++) {
                    for (var oneProp = 0; oneProp < ResqLis[oneRes].indexProperties.length; oneProp++) {
                        SubQN++;
                        if (SubQN == 1) {
                            Query += '{\n';
                        } else {
                            Query += 'union {\n';
                        }
                        if (!EndpointLocal) {
                            Query += 'service <' + Service + '> {\n';
                        }
                        var Class_ = ResqLis[oneRes].resourceClass;
                        var Property_ = ResqLis[oneRes].indexProperties[oneProp];
                        var PropertyName_ = ResqLis[oneRes].indexPropertiesName[oneProp];
                        var Label_ = ResqLis[oneRes].labelProperty;

                        switch (typeServer) {
                          case 'Apache Marmotta':
                                  {
                                    Query += 'select  (1 as  ?Score1) (\'' + ServiceName + '\' AS ?Endpoint) ?EntityURI (<' + Class_ + '> AS ?EntityClass)  ';
                                    Query += '?EntityLabel (<' + Property_ + '> AS ?Property) (\'' + PropertyName_ + '\' AS ?PropertyLabel) ?PropertyValue   ';
                                    Query += '?Year ?Lang  (<'+Class_+'> as ?Type) (1 as ?Score )  ?Image  \n';
                                    Query += '{  ';//graph <'+ServiceGrapUri+'> {\n ' ;
                                    Query += '?EntityURI <'+Property_+'> ?PropertyValue .';
                                    Query += '?EntityURI <' + Label_ + '> ?EntityLabel .';
                                    Query += "optional { ?EntityURI <http://purl.org/dc/terms/language> ?Lang .   } \n";
                                    Query += "optional { ?EntityURI <http://purl.org/dc/terms/issued> ?Year .  }\n";
                                    Query += "optional { ?EntityURI <http://purl.org/ontology/bibo/Image> ?Image .  }\n";
                                    //Query += "optional { ?EntityURI  ?x ?creator . }\n";
                                    //Query += "optional { ?creator <http://xmlns.com/foaf/0.1/name> ?name .}\n";
                                    Query += ' ?EntityURI a <' + Class_  + '>  \n';
                                    var auxFullText='FILTER( mm:fulltext-search(str(?PropertyValue), "'+TextSearch+'", "es") )';
                                    Query += auxFullText.replace(/AND/g, "&");
;
                                    Query += '} limit 50 \n';

                                  }

                            break;
                          case 'fuseki':
                                  {
                                   Query += 'select   ?Score1 (\'' + ServiceName + '\' AS ?Endpoint) ?EntityURI (IRI(<' + Class_ + '>) AS ?EntityClass) ?EntityLabel (IRI(<' + Property_ + '>) AS ?Property) (\'' + PropertyName_ + '\' AS ?PropertyLabel) ?PropertyValue  (max(?Year1)as ?Year) (max(?Lang1) as ?Lang) (max(?Type1) as ?Type)  ((?Score1*if(count(?Score2)>0,2,1)*if(count(?Score3)>0,2,1)*if(count(?Score4)>0,' + ty + ',1)) as ?Score )   ?Image  ?organization_des \n'; //(group_concat(?Sub1; separator = "#|#") as ?Sub)
                                   Query += '{\n';
                                   Query += '(?EntityURI ?Score1 ?PropertyValue) text:query (<' + Property_ + '> \'(' + TextSearch + ')\' ' + ResultLimitSubQ + ') .\n?EntityURI <' + Label_ + '> ?EntityLabel .\n';
                                   Query += 'filter(str(?PropertyValue)!=\'\') .\n';
                                   Query += "optional { (?EntityURI ?Score2 ?PropertyValue2) text:query (<http://purl.org/dc/terms/subject> '(" + int + ")' ) .  filter(str(?EntityURI)!=\'\') .} \n"
                                   //Query += "optional { ?EntityURI <http://purl.org/dc/terms/subject> ?Sub1 .  } \n"
                                   Query += "optional { ?EntityURI <http://purl.org/dc/terms/language> ?Lang1 .   } \n"
                                   Query += "optional { ?EntityURI <http://purl.org/dc/terms/language> ?Lang2 .  filter(str(?Lang2) = '" + idi + "'). bind( 1 as ?Score3  ).  } \n"
                                   Query += "optional { ?EntityURI <http://purl.org/dc/terms/issued> ?y2. bind( strbefore( ?y2, '-' ) as ?y3 ).  bind( strafter( ?y2, ' ' ) as ?y4 ). bind( if (str(?y3)='' && str(?y4)='',?y2,if(str(?y3)='',?y4,?y3)) as ?Year1 ).  }\n";
                                   Query += "optional { ?EntityURI <http://purl.org/ontology/bibo/Image> ?Image .  }\n";
                                   Query += "optional { ?EntityURI  <http://purl.org/dc/terms/provenance> ?provenance .\n";
                                   Query += " ?provenance <http://purl.org/dc/terms/description> ?organization_des .}\n";
                                   Query += "optional { ?EntityURI a ?Type1 . filter (str(?Type1) != 'http://xmlns.com/foaf/0.1/Agent' &&  str(?Type1) != 'http://purl.org/ontology/bibo/Document') .   } \n"
                                   Query += "optional { {?EntityURI a <http://purl.org/ontology/bibo/Article> .  bind(1 as ?Score4  ). } union { ?EntityURI a <http://purl.org/net/nknouf/ns/bibtex#Mastersthesis> .  bind(1 as ?Score4  ). }  } \n"
                                //   Query += ' { EntityURI a <' + Class_ + '>} \n'
                                   Query += '} group by ?Endpoint ?EntityURI ?EntityClass ?EntityLabel ?Property ?PropertyLabel ?PropertyValue ?Score1 ?Image  ?organization_des limit 100 \n';

                                  }

                            break;

                          default:
                                  {
                                   Query += 'select  distinct ?Score1 (\'' + ServiceName + '\' AS ?Endpoint) ';
                                   Query += '?EntityURI (IRI(<' + Class_ + '>) AS ?EntityClass) ';
                                   Query += '?EntityLabel (IRI(<' + Property_ + '>) AS ?Property) ';
                                   Query += '(\'' + PropertyName_ + '\' AS ?PropertyLabel) ?PropertyValue  ';
                                   Query += '(?Year1 as ?Year) (?Lang1 as ?Lang) (?Type1 as ?Type)  ';
                                   Query += '(1 as ?Score )  ';
                                   Query += ' ?Image  ?organization_des \n'; //(group_concat(?Sub1; separator = "#|#") as ?Sub)'
                                   Query += '{\n';
                                   Query += '(?EntityURI ?Score1 ?PropertyValue) text:query (<' + Property_ + '> \'(' + TextSearch + ')\' ' + ResultLimitSubQ + ') .\n?EntityURI <' + Label_ + '> ?EntityLabel .\n';
                                   Query += 'filter(str(?PropertyValue)!=\'\') .\n';
                                   Query += "optional { (?EntityURI ?Score2 ?PropertyValue2) text:query (<http://purl.org/dc/terms/subject> '(" + int + ")' ) . ";
                                   Query += " filter(str(?EntityURI)!=\'\') .} \n";
                                   //Query += "optional { ?EntityURI <http://purl.org/dc/terms/subject> ?Sub1 .  } \n"
                                   Query += "optional { ?EntityURI <http://purl.org/dc/terms/language> ?Lang1 .   } \n";
                                   //Query += "optional { ?EntityURI <http://purl.org/dc/terms/language> ?Lang2 .  filter(str(?Lang2) = '" + idi + "'). bind( 1 as ?Score3  ).  } \n"
                                   Query += "optional { ?EntityURI <http://purl.org/dc/terms/issued>  ?Year1 .}";//?y2. bind( strbefore( ?y2, '-' ) as ?y3 ).
                                   //Query += " bind( strafter( ?y2, ' ' ) as ?y4 ). bind( if (str(?y3)='' && str(?y4)='',?y2,if(str(?y3)='',?y4,?y3)) as ?Year1 ).  }\n";
                                   Query += "optional { ?EntityURI <http://purl.org/ontology/bibo/Image> ?Image .  }\n";
                                   Query += "optional { ?EntityURI  <http://purl.org/dc/terms/provenance> ?provenance .\n";
                                   Query += " ?provenance <http://purl.org/dc/terms/description> ?organization_des .}\n";
                                   Query += "optional { ?EntityURI a ?Type1 . filter (str(?Type1) != 'http://xmlns.com/foaf/0.1/Agent' &&  str(?Type1) != 'http://purl.org/ontology/bibo/Document') .   } \n"
                                   //Query += "optional { {?EntityURI a <http://purl.org/ontology/bibo/Article> .  bind(1 as ?Score4  ). } union { ?EntityURI a <http://purl.org/net/nknouf/ns/bibtex#Mastersthesis> .  bind(1 as ?Score4  ). }  } \n"
                                   Query += " ?EntityURI a <" + Class_ + "> \n";
                                   Query += '} limit 100';//group by ?Endpoint ?EntityURI ?EntityClass ?EntityLabel ?Property ?PropertyLabel ?PropertyValue ?Score1 ?Image  ?organization_des limit 50 \n';

                                  }
                                  break;
                        }
                        if (!EndpointLocal) {
                            Query += '}\n';
                        }
                        Query += '}\n';
                      //  console.log(Query);
                    }
                }
                var source = {};
                source.Name = ServiceName;
                source.Endpoint = Service;
                sources.push(source);

            }
          //  console.log("Hasta aqui");
          //console.log(sources);
            if (!_.isNull(Meteor.userId())) {
                var rest = Meteor.call('savesearch', originTextSearch, sources, EntitySearch, function (error, result) {
                    //console.log(result);
                });
            }

            Query += ' . filter(str(?EntityURI)!=\'\') . }  order by DESC(?Score)  \n  ' + ResultLimit+' ';
            var jsonRequest = {"sparql": Query, "validateQuery": false, "MainVar": "EntityURI", "ApplyFilter": AppFilt};
            //console.log(jsonRequest);
            Session.set('jsonRequest', jsonRequest);
            App.SearchRun(0, 1);
            //Session.set('Qmode', 1);
        });


        if (term != "null") {
            $(".textToSearch").val(term);


            switch (type) {
                case 'autores':
                    $("#autores2").attr('checked', 'checked');
                    break;
                case 'documentos':
                    $("#documentos2").attr('checked', 'checked');
                    break;
                case 'colecciones':
                    $("#colecciones2").attr('checked', 'checked');
                    break;
            }

            darclick(FromList);
        }

    }



});

function darclick(FromList) {
    // console.log("Dar click");

    var result2 = Meteor.call('findAllEndpoints', function (error, en) {
        // FromList.push({attributes:{"data-base": true , "data-endpoint": result.endpoint , "data-graphuri" : result.graphURI }}) ;
        // alert("Hola");
        for (var i = 0; i < en.length; i++) {
            var result = en[i];
            FromList.push({attributes: {"data-base": {"value": result.base}, "data-endpoint": {"value": result.endpoint}, "data-graphuri": {"value": result.graphURI}, "data-name": {"value": result.name},"data-typeserver": {"value": result.typeServer}}});
            //FromList.push({attributes: {"data-base": {"value": true}, "data-endpoint": {"value": result.endpoint}, "data-graphuri": {"value": result.graphURI}, "data-name": {"value": result.name}}});
        }
        $('input.runSearch').click();
    });
}
;

function get_checkList_values(CheckName) {
    var inputs = document.getElementsByName(CheckName);
    var values = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            values.push(inputs[i]);
        }
    }
    return values;
}
;

function get_radio_value(RadioName) {
    var inputs = document.getElementsByName(RadioName);
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].checked) {
            return inputs[i].value;
        }
    }
}
;





highfn = function () {
    //$('.contvarpro').empty();
    var TextSearch = $(".textToSearch").val();
    var res = TextSearch.split(" ");
    for (var i = 0; i < res.length; i++) {
        if (!(res[i].trim().length === 0)) {
            $('.hglttxt').highlight(res[i].trim(), {caseSensitive: false});
        }
    }
};

unhighfn = function () {
    $('.hglttxt').unhighlight();
};

function contieneType(elemento) {
    return elemento.indexOf("type") > -1;
}
;

linkg = function (e) {
    var obj = e.target;
    if (obj.tagName == "IMG") {
        obj = obj.parentElement;

    }
    var en = Endpoints.find({name: obj.attributes['data-endpoint'].value}).fetch()[0]
    var v1 = encodeURIComponent(obj.attributes['data-uri'].value);
    var v2 = encodeURIComponent(en.endpoint);
    var v3 = encodeURIComponent(en.graphURI);
    var v4 = encodeURIComponent(en.typeServer);
    window.open('/buscador/graph/' + v1 + '/' + v2 + '/' + v3 + '/' + v4);
    interestitem(obj.attributes['data-uri'].value);
};

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
function isRec(d) {
 return  d.includes('rec');
}
linkg2 = function (e) {
    var obj = e.target;
    if (obj.tagName == "SPAN") {
        obj = obj.parentElement;
    }
    var en = Endpoints.find({name: obj.attributes['data-endpoint'].value}).fetch()[0];
    var v1 = obj.attributes['data-uri'].value;
    var v2 = en.endpoint;
    var v3 = en.graphURI;
console.log(v1.indexOf("/organizacion"));
console.log(v1.indexOf("/publisher"));
console.log(v1.indexOf("/collection"));
console.log(v1.indexOf("/coleccion"));
console.log(v1.indexOf("/rec/cdjbv/contribuyente"));



    if(v1.indexOf("/organizacion") >= 0 || v1.indexOf("/publisher") >= 0 || v1.indexOf("/collection") >= 0 || v1.indexOf("/coleccion") >= 0  ||  v1.indexOf("/rec/cdjbv/contribuyente")>=0)
    {
      var v1 = encodeURIComponent(obj.attributes['data-uri'].value);
      var v2 = encodeURIComponent(en.endpoint);
      var v3 = encodeURIComponent(en.graphURI);
      var v4 = encodeURIComponent(en.typeServer);
      window.open('/buscador/graph/' + v1 + '/' + v2 + '/' + v3 + '/' + v4);
    }
    else{
            var redirectWindow = window.open('', '_blank');
            Meteor.call('runQuery', v2, v3, 'select ?a {<' + v1 + '> <http://purl.org/ontology/bibo/handle> ?a} limit 1', function (error, result) {
                if (result) {
                    var r = JSON.parse(result.content).results.bindings;
                    if (r.length == 0) {
                        redirectWindow.location = v1;
                    } else {
                        redirectWindow.location = r[0].a.value;
                    }
                } else {
                    redirectWindow.location = v1;
                }
            }
          );
        }
    interestitem(v1);
};

ValidateSuggestionQuery = function (query) {
    var errMsj = '';
    try {
        var sq = query;
        errMsj = "filter missing, suggestion queries need a filter statement";
        var resp = sq.match(new RegExp("REGEX\\((.*),", "g"));  //[0]
        var respp = 0;
        if (resp && resp.length > 0) {
            resp = resp[0];
            respp = 1;
        } else {
            respp = 2;
            resp = sq.match(new RegExp("\\((.*)\\)(.*)\\((.*)\\)", "g"))[0];
        }
        errMsj = "filtering variable missing into regex";
        var SearchVar = '';
        if (respp == 1) {
            SearchVar = resp.split('(')[1].split(',')[0];
        } else {
            SearchVar = resp.split(' ?Score1 ')[1].split(')')[0];
        }
        errMsj = "Main variable not found";
        resp = sq.match(new RegExp("(.*) a", "g"))[0];
        var MainVar = resp.split(' ')[0];
        errMsj = "Type variable not found";
        resp = sq.match(new RegExp(" (.*) \.", "g")).filter(contieneType)[0];
        resp = resp.split(' ');
        var TypeVar = resp[resp.length - 2];
        var NewSQ = sq.replace(new RegExp("SELECT", "g"), 'SELECT ' + SearchVar + '');
        NewSQ = NewSQ.replace(new RegExp("FROM(.*)", "g"), '');
        var TextSearch = 'x';
        var v2 = NewSQ;
        NewSQ = NewSQ.replace(new RegExp("'wildcard'", "g"), TextSearch);
        errMsj = "'wildcard' missing";
        if (v2 == NewSQ) {
            throw "Too big";
        }
        var Query = 'select * {\n';
        var SubQN = 0;
        var TitleVar = sq.match(new RegExp("SELECT (.*)", "g"))[0].replace(new RegExp("SELECT ", "g"), '').split(' ');
        var i = TitleVar.indexOf(MainVar);
        TitleVar.splice(i, 1);
        i = TitleVar.indexOf(TypeVar);
        TitleVar.splice(i, 1);
        TitleVar.filter(function (v) {
            return v.trim() != '';
        });
        errMsj = "Title variable not found";
        var tem = TitleVar[0].length;

        errMsj = '';
    } catch (e) {
        //return false;
    }
    return errMsj;
};

actAHyper = function (e) {
    //Session.set("auxAct", Session.get("auxAct") + 1);
    //App.resultCollection2.remove({});

    var usr = Profile.findOne({idProfile: Meteor.userId()});
    var idi = 'none';
    var ty = '1';
    var int = '';
    if (usr) {
        idi = usr.language;
        if (usr.levelAcademic == 1) {
            ty = 2;
        }
        if (usr.levelAcademic == 2) {
            ty = 3;
        }
        if (usr.areasInterest != undefined && Array.isArray(usr.areasInterest)) {
            var inte = usr.areasInterest;
            for (var sd = 0; sd < inte.length; sd++) {
                int += '(' + AndStr(lang.getDictionnary('es')['FoS_' + inte[sd]]) + ') OR ';
                int += '(' + AndStr(lang.getDictionnary('en')['FoS_' + inte[sd]]) + ')' + ((sd != inte.length - 1) ? ' OR ' : '');
            }
        }
    }
    if (int == '') {
        int = '_';
    }



    var AppFilt = false;
    var r = e.currentTarget.attributes['data-title'];
    var w = Queries.find({title: r.value}).fetch();
    var sq = w[0].sparql;
//                var resp = sq.match(new RegExp("REGEX\\((.*),","g"))[0];
    var resp = sq.match(new RegExp("REGEX\\((.*),", "g"));  //[0]
    var respp = 0;
    if (resp && resp.length > 0) {
        resp = resp[0];
        respp = 1;
    } else {
        var EntitySearch = get_radio_value("opciones");
        if (EntitySearch != "documentos") {
            AppFilt = true;
        }
        respp = 2;
        resp = sq.match(new RegExp("\\((.*)\\)(.*)\\((.*)\\)", "g"))[0];
    }

    //var SearchVar = resp.split('(')[1].split(',')[0];
    var txtvar = '';
    var SearchVar = '';
    if (respp == 1) {
        SearchVar = resp.split('(')[1].split(',')[0];
    } else {
        SearchVar = resp.split(' ?Score1 ')[1].split(')')[0];
        txtvar = '?Score1 '
    }
    resp = sq.match(new RegExp("(.*) a", "g"))[0];
    var MainVar = resp.split(' ')[0];
    resp = sq.match(new RegExp(" (.*) \.", "g")).filter(contieneType)[0];
    resp = resp.split(' ');
    var TypeVar = resp[resp.length - 2];

    var varia = '*';
    var varia2 = '*';
    var patt = new RegExp("SELECT DISTINCT(.*)\n", 'g');
    var res = patt.exec(sq);
    if (res != null) {
        if (respp == 1) {
            varia2 = res[1] + ' ' + txtvar + SearchVar + ' ?Endpoint ?Score1 ';
        } else {
            varia2 = res[1] + ' ' + txtvar + SearchVar + ' ?Endpoint';
        }

        varia = res[1] + ' ' + txtvar + SearchVar + ' ?Endpoint (max(?Year1) as ?Year) (max(?Lang1) as ?Lang) (max(?Type1) as ?Type) ((?Score1*if(count(?Score2)>0,2,1)*if(count(?Score3)>0,2,1)*if(count(?Score4)>0,' + ty + ',1)) as ?Score ) '; //(group_concat(?Sub1; separator = "#|#") as ?Sub)
    }
    //Obtener original

    var NewSQ = sq.replace(new RegExp("SELECT DISTINCT ", "g"), 'SELECT DISTINCT ' + txtvar + SearchVar + ' ?Year1 ?Lang1 ?Type1 ?Score1 ?Score2 ?Score3 ?Score4 ');
    NewSQ = NewSQ.replace(new RegExp("FROM(.*)", "g"), '');
    var TextSearch = $(".textToSearch").val();
    if (respp == 2) {
        TextSearch = TextSearch.clearWords();
        if (!AppFilt) {
            TextSearch = TextSearch.trim().replace(/\s+/g, ' ');
            TextSearch = TextSearch.replace(/\s/g, " AND ");
        }
        var ResultLimitSubQ = (AppFilt) ? '15' : '1000';
        NewSQ = NewSQ.replace(new RegExp("'wildcard'", "g"), '(' + TextSearch + ')').replace(new RegExp("@0@", "g"), ResultLimitSubQ);
    } else {
        NewSQ = NewSQ.replace(new RegExp("'wildcard'", "g"), TextSearch);
    }
    var FromList = get_checkList_values("repositoriesList");
    var Query = 'select ' + varia + ' {\n';
    var SubQN = 0;
    var TitleVar = sq.match(new RegExp("SELECT DISTINCT (.*)", "g"))[0].replace(new RegExp("SELECT DISTINCT ", "g"), '').split(' ');
    var i = TitleVar.indexOf(MainVar);
    TitleVar.splice(i, 1);
    i = TitleVar.indexOf(TypeVar);
    TitleVar.splice(i, 1);
    TitleVar.filter(function (v) {
        return v.trim() != '';
    });
    Session.set('SearchVar', SearchVar);
    Session.set('MainVar', MainVar);
    Session.set('TypeVar', TypeVar);
    Session.set('TitleVar', TitleVar[0]);
    for (var oneQuery = 0; oneQuery < FromList.length; oneQuery++) {
        var EndpointLocal = FromList[oneQuery].attributes['data-base'] ? FromList[oneQuery].attributes['data-base'].value : false;
        var Service = FromList[oneQuery].attributes['data-endpoint'].value;
        var ServiceName = FromList[oneQuery].attributes['data-name'].value;
        SubQN++;
        if (SubQN == 1) {
            Query += '{\n';
        } else {
            Query += 'union {\n';
        }
        if (!EndpointLocal) {
            Query += 'service <' + Service + '> {\n';
        }
        var NewSQ2 = NewSQ.replace(new RegExp("SELECT DISTINCT", "g"), "SELECT DISTINCT ('" + ServiceName + "' AS ?Endpoint) ?Score2 ?Score3 ?Score4 ");
        var sr = '';
        if (respp == 2) {
            sr = "";
        } else {
            sr = "  bind(1 as ?Score1). ";
        }
        NewSQ2 = NewSQ2.replace(/\}\n\}$/, sr + "optional { (" + MainVar + " ?Score2 ?PropertyValue2) <http://jena.apache.org/text#query> (<http://purl.org/dc/terms/subject> '(" + int + ")' ) .    filter(str(" + MainVar + ")!=\'\') . } \n   optional { " + MainVar + " <http://purl.org/dc/terms/language> ?Lang1 .  } \n optional { " + MainVar + " <http://purl.org/dc/terms/language> ?Lang2 .  filter(str(?Lang2) = '" + idi + "'). bind( 1 as ?Score3  ).  } \n optional { " + MainVar + " <http://purl.org/dc/terms/issued> ?y2. bind( strbefore( ?y2, '-' ) as ?y3 ).  bind( strafter( ?y2, ' ' ) as ?y4 ). bind( if (str(?y3)='' && str(?y4)='',?y2,if(str(?y3)='',?y4,?y3)) as ?Year1 ).  }\n  optional { " + MainVar + " a ?Type1 . filter (str(?Type1) != 'http://xmlns.com/foaf/0.1/Agent' &&  str(?Type1) != 'http://purl.org/ontology/bibo/Document')  } \n optional { {" + MainVar + " a <http://purl.org/ontology/bibo/Article> .  bind(1 as ?Score4  ). } union { " + MainVar + " a <http://purl.org/net/nknouf/ns/bibtex#Mastersthesis> .  bind(1 as ?Score4  ). }  } \n }} ");

        Query += NewSQ2 + "\n";
        if (!EndpointLocal) {
            Query += '}\n';
        }
        Query += '}\n';
    }
    Query += '} group by ' + varia2 + ' \n';
    //if (respp == 2) {
    Query += 'order by desc(?Score)\n';
    //}

    var jsonRequest = {"sparql": Query, "validateQuery": false, "MainVar": MainVar.replace('?', ''), "ApplyFilter": AppFilt};
    Session.set('jsonRequest', jsonRequest);
    //Session.set('Qmode', 2);
    App.SearchRun(0, 2);
};

function selec2(prev, val) {
    if (prev == $('input:radio[id=' + val + '2]').val()) {
        $(".recurso").text("Buscando por: Todo");
        prev = "";
        $('input:radio[id=' + val + '2]').attr('checked', false);
    } else {
        $(".recurso").text("Buscando por: " + val.charAt(0).toUpperCase() + val.slice(1));
        prev = $('input:radio[id=' + val + '2]').val();

    }
    Session.set('auxAct', Session.get('auxAct') + 1);
    return prev;
}

qrmodalshow = function (e, base, type) {
    console.log(e);

    var direccion = e;
    console.log(direccion);
    $("#qrarea1").empty();
    $("#qrarea2").empty();
    /* var qrcode = new QRCode( $(".qrarea") , {
     width : 100,
     height : 100
     });*/
    // qrcode.makeCode("http://localhost:3000");
    /*var area = $(".qrarea");*/
    //  $(".qrarea").qrcode ( {width: 100 ,height: 100,text: direccion });

    if (type.includes("file")) {
        $(".optionalqr").css("display", "");
        fuente(e, base);

    } else {
        // $("#qrarea2").css("display","none");
        $(".optionalqr").css("display", "none");
        $("#qrarea1").attr("class", "tab-pane fade   in active");
        $("#qrarea2").attr("class", "tab-pane fade");
    }


    $("#qrarea1").qrcode({width: 125, height: 125, text: direccion});

    //  $("#qrarea2").qrcode ( {width: 125 ,height: 125,text: "http://localhost" });
    $("#myqrmodal").modal();
    interestitem(e);
}

download = function (URI) {
    $("#mydwmodal").modal();
    $("#mydwmodal").attr("URI", URI);
    interestitem(URI);


}

downloadaction = function (e) {
    var formatcod = $("select[id=format]").val();
    var uri = $("#mydwmodal").attr("URI");
    var formatext = "";

    switch (formatcod)
    {
        case '0':
            formatext = "xml";
            break;
        case '1':
            formatext = "text";
            break;
        case '2':
            formatext = "json";
            break;
        case '3':
            formatext = "rdf";
            break;

    }

    // alert (uri+"."+formatext);
    //  console.log (format+ uri);
    /*
     $.get("file:///home/joe/EJemplo.html", function(response) {
     alert(response) ;
     });*/

    var request = new XMLHttpRequest();
    request.open("GET", uri + "." + formatext);
    // request.open("GET", 'http://localhost:3000/stats');

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            console.log(request.response);


            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(request.response));
            element.setAttribute('download', "file" + "." + formatext);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);


        } else {
            console.log(request);
        }
    };
    request.send(null); // Send the request now*/
}

hide = function (e) {

    if ($(".oculto").css("display") == "inline")
    {
        $(".oculto").css("display", "none");
    } else {
        $(".oculto").css("display", "inline");
        //  alert ("Hola");
    }
}


favaction = function (uri, label)
{
    if (!_.isNull(Meteor.userId())) {
        Meteor.call('savefavresource', uri, label, function (error, result) {
            console.log(result);
            // alert (result);
        });
    } else {
        alert("Por favor, ingrese un usuario para utilizar esta característica");
    }

}

rdflink = function (URI) {
    window.open(URI);
    interestitem(URI);
}

function fuente(uri, base) {

    var en = Endpoints.find({name: base}).fetch()[0];
    var v1 = uri;
    var v2 = en.endpoint;
    var v3 = en.graphURI;
    // var redirectWindow = window.open('', '_blank');
    Meteor.call('runQuery', v2, v3, 'select ?a {<' + v1 + '> <http://purl.org/ontology/bibo/handle> ?a} limit 1', function (error, result) {
        if (result) {
            var r = JSON.parse(result.content).results.bindings;
            if (r.length == 0) {
                // redirectWindow.location = v1;
                //$("#qrarea2").qrcode ( {width: 125 ,height: 125,text:  r[0].a.value });

            } else {
                $("#qrarea2").qrcode({width: 125, height: 125, text: r[0].a.value});
                //redirectWindow.location = r[0].a.value;
            }
        } else {
            ///   redirectWindow.location = v1;
        }
    }
    );
}
;

function interestitem(URI) {

    // alert (URI);
    if (!_.isNull(Meteor.userId())) {
        Meteor.call('saveinterest', URI, function (error, result) {
            console.log(result);
            // alert (result);
        });
    }
}


desplegar = function (e) {
    // $("#sug").collapse('toggle');

    if (Session.get('DespSug')) {
        $("#psug").css("min-height", "40px");
        $("#sug").collapse('hide');
        Session.set('DespSug', false);
        // $(".sugestion-panel").css ("min-height", "400px");

    } else {
        $("#sug").collapse('show');
        Session.set('DespSug', true);
        //$(".sugestion-panel").css ("min-height", "400px");
        //   $("#sug").collapse();
    }
    //alert ("Desplegar");
}
desplegar2 = function (e) {
    // $("#sug").collapse('toggle');

    if (Session.get('DespFac')) {
        $("#pfac").css("min-height", "40px");
        $("#fac").collapse('hide');
        Session.set('DespFac', false);
        // $(".sugestion-panel").css ("min-height", "400px");

    } else {
        $("#fac").collapse('show');
        Session.set('DespFac', true);
        //$(".sugestion-panel").css ("min-height", "400px");
        //   $("#sug").collapse();
    }
    //alert ("Desplegar");
}
