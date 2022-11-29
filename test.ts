const express = require('express')
const app = express()
const port = 3000
const unzip = require('unzip-stream')


app.get('/tp', (req, res) => {
    const telechargement = require('download');
    const fs = require('fs')
    const csv = require('csv-parser')
    const results = [];

    telechargement('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            const file = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (file === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const transfert = results.filter(result => result.transfertSiege == 'true')
                    const percent = transfert.length / results.length * 100
                    let resultat = percent.toFixed(1)
                    res.send(`Before November 1, 2022 there were approximately ${resultat}% of companies that transferred their headquarters`)
                } )
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`Mon rendu du TP est sur localhost:${port}/tp`))
