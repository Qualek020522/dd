const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const ipsFile = path.join(__dirname, 'ips.json');

if (!fs.existsSync(ipsFile)) {
    fs.writeFileSync(ipsFile, JSON.stringify([]));
}

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const time = new Date().toISOString();

    fs.appendFileSync('logi.txt', `${time} - IP: ${ip}\n`);

    let ips = JSON.parse(fs.readFileSync(ipsFile));
    if (!ips.includes(ip)) {
        ips.push(ip);
        fs.writeFileSync(ipsFile, JSON.stringify(ips, null, 2));
    }

    next();
});

app.get('/licznik', (req, res) => {
    const ips = JSON.parse(fs.readFileSync(ipsFile));
    res.json({ liczba: ips.length });
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
