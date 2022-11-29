var express = require('express');
var app = express();
var port = 3000;
var unzip = require('unzip-stream');

app.get('/tp', function (req, res) {
    var telechargement = require('download');
    var fs = require('fs');
    var csv = require('csv-parser');
    var transfert = 0;
    var total = 0;
    telechargement('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var file = entry.path;
            
            if (file === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) { 

                        total = total + 1 ; 

                        if (data.transfertSiege == 'true'){
                            transfert = transfert + 1;
                        } 
                     })
                    .on('end', function () {
                    var percent = transfert / total * 100;
                    var resultat = percent.toFixed(1);
                    res.send("Before November 1, 2022 there were approximately ".concat(resultat, "% of companies that transferred their headquarters"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    });
});
app.listen(port, function () { return console.log("Mon rendu du TP est sur localhost:".concat(port, "/tp")); });
