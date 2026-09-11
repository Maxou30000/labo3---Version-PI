var express = require('express');
var gpio = require('./gpio');
var app = express();

var etats = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
};

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index', {
        modules: [1, 2, 3, 4, 5, 6].map(function (numero) {
            return {
                numero: numero,
                etat: etats[numero]
            };
        })
    });
});

app.get('/contact', function (req, res) {
    res.send(`
    <h1>Page de contact</h1>

    <table>
      <tr>
        <th>Nom</th>
        <th>Adresse</th>
        <th>Téléphone</th>
      </tr>
      <tr>
        <td>Maxim Jacquet</td>
        <td>244 Rue Northcliffe</td>
        <td>123 456 7890</td>
      </tr>
    </table>
    <a href="/">Retour à l'accueil</a>
  `);
});

app.get('/reset', function (req, res) {
    for (var i = 1; i <= 6; i++) {
        etats[i] = 0;
    }
    gpio.reset();
    res.redirect('/module');
});

app.get('/module', function (req, res) {
    res.render('index', {
        modules: [1, 2, 3, 4, 5, 6].map(function (numero) {
            return {
                numero: numero,
                etat: etats[numero]
            };
        })
    });
});

// Généré par copilot intégré
app.get('/module/:numero', function (req, res) {
    var numero = Number(req.params.numero);

    if (!Number.isInteger(numero) || numero < 1 || numero > 6) {
        return res.send('<h1>Module inconnu</h1>');
    }

    // Change 0 to 1, or 1 to 0
    etats[numero] = etats[numero] === 0 ? 1 : 0;
    gpio.setModuleState(numero, etats[numero]);

    res.render('module', {
        numero: numero,
        etat: etats[numero]
    });
});
//Fin de la section copilot intéré

app.use(function (req, res) {
    res.writeHead(404);
    res.end("Erreur 404: Page introuvable!")
});

var server = app.listen(8080);
console.log("Le serveur est lancé sur le port 8080");

function shutdown() {
    gpio.reset();
    gpio.close();
    server.close(function () {
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
