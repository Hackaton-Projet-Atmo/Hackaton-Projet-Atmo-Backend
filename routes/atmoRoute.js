const https = require("https");
const { poolPromise } = require('../util/database'); // Assurez-vous que le chemin d'accès est correct
const sql = require('mssql');

function csvToArray(csv) {
    const rows = csv.split('\n');
    const result = [];
    for (const row of rows) {
        const values = row.split(',');
        result.push(values);
    }
    return result;
}

const url = "https://atmo-bfc.iad-informatique.com/geoserver/mesure/wfs?SERVICE=WFS&REQUEST=GetFeature&typename=mes_bfc_horaire_poll_princ&count=1000&sortBy=date_fin%20D&outputformat=csv";


console.log("test 1 ")
https.get(url, (res) => {
    let csv = "";
    res.on('data', (str) => {
        csv += str;
    });
    res.on('end', async function() {
        const data = csvToArray(csv);
        const cleanData = [];
        data.forEach((el) => {
            if (el[3] === "Dijon") {
                cleanData.push({
                    ville: el[3],
                    station: el[5],
                    nom_poll: el[9],
                    valeur: el[11],
                    unite: el[12],
                    date: el[14].slice(0, 10)
                });
            }
        });

        try {
            const pool = await poolPromise;
            for (const item of cleanData) {
                const result = await pool.request()
                    .input('ville', sql.VarChar, item.ville)
                    .input('station', sql.VarChar, item.station)
                    .input('nom_poll', sql.VarChar, item.nom_poll)
                    .input('valeur', sql.Float, item.valeur)
                    .input('unite', sql.VarChar, item.unite)
                    .input('date', sql.Date, item.date)
                    .query('INSERT INTO dbo.atmo (ville, station, nom_poll, valeur, unite, date) VALUES (@ville, @station, @nom_poll, @valeur, @unite, @date)');
            }
            console.log('Données insérées avec succès');
        } catch (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
        }
    });
});

