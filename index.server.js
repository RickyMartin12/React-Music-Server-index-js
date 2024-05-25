const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { appData } = require("./mock");
const app = express();
const http = require('http');
const PORT = process.env.PORT || 9000;

const __AUDIO_TYPE__ = {
    ROCK: "rock",
    JAZZ: "jazz",
    CINEMATIC: "cinematic",
    ACCOUSTIC: "accoustic",
    LIFETIME: "lifetime"
}

function getDirectories(type){
    return fs.readdirSync(`./music/${type}`);
}

function getSongDetails(type, dir){
    try{
        const path = `music/${type}/${dir}/media`;
        const audioData = fs.readdirSync(path);
        const audioInfo = fs.readFileSync(`./music/${type}/${dir}/info.json`);
        const parsedData = JSON.parse(audioInfo);
        return {
            audioFile: `${path}/${audioData[0]}`,
            avatar: `${path}/${audioData[1]}`,
            ...parsedData
        }
    }catch(error){
        return false;
    }
}


app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "https://music-player-react-js.herokuapp.com");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

  httpServer = http.createServer(app);

app.use(cors());
app.use('/music', express.static(__dirname + '/music'));

app.get(`/song`, (req, res) => {
    const songData = {};
    for(let type in __AUDIO_TYPE__){
        const directoryItems = getDirectories(__AUDIO_TYPE__[type]);
        directoryItems.forEach((item) => {
            const audioData = getSongDetails(__AUDIO_TYPE__[type], item);
            if(audioData){
                if(__AUDIO_TYPE__[type] in songData){
                    songData[__AUDIO_TYPE__[type]].push(audioData);
                }else{
                    songData[__AUDIO_TYPE__[type]] = [audioData];
                }
            }            
        })
    }
    appData['freelicense'] = songData

    res.status(200).json({ appData });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})