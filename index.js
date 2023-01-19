import {Client, MessageEmbed} from "discord.js";
import fs from "fs";
import scrape from "website-scraper";
import child_process from "child_process";
import { resolve } from "path";

//C:\Windows\System32\cmd.exe /C cd ../../Node/VALORANT/VALORANT & node index.js

const version = 'v2.3.0: patch -rafistolage_a_la_main'

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
});

const author = '989830615706783754';

const discordChannel = '974339936171982928';


try{
    if(fs.existsSync('./trash')){
        fs.rmSync('./trash', {recursive: true, force: true});
        console.log("flush")
    }
    const data = fs.readFileSync('backup.json');
    fs.writeFileSync('bdd.json', data);
    
}
catch{

}

import bdd from "./backup.json" assert {type: 'json'};
const nbUser = bdd['user'].length;

client.once('ready', () => {
    console.log('Bot turned on');
    //main();
    display();
});
    
//turn off the bot and kill programm properly
client.on('messageCreate', (message) => {
    if (message.author.id == author){
        process.exit();
    }   
    /*else{
        const user = message.mentions.users.first();
        message.channel.send(user.tag);
    }*/
});



client.login(bdd['pass']);

function savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("une erreur est survenue")
    })
}

function sort(){
    const l = bdd['user'].length;
    for (var i = l; i >= 1; i = i-1){
        for (var j = 0; j<i-1; j++){
            if (bdd['user'][j+1]['rank'] > bdd['user'][j]['rank']){
                var tmpName = bdd['user'][j+1]['name'];
                var tmpRank = bdd['user'][j+1]['rank'];
                var tmpTrack = bdd['user'][j+1]['tracker'];
                bdd['user'][j+1]['name'] = bdd['user'][j]['name'];
                bdd['user'][j+1]['rank'] = bdd['user'][j]['rank'];
                bdd['user'][j+1]['tracker'] = bdd['user'][j]['tracker'];
                bdd['user'][j]['name'] = tmpName;
                bdd['user'][j]['rank'] = tmpRank;
                bdd['user'][j]['tracker'] = tmpTrack;
                savebdd();
            }
        }
    }
}

function getRank(player,i){
    return new Promise((resolve) => {
        const url = 'https://tracker.gg/valorant/profile/riot/' + player + '/overview';
        const options = {
            urls: [url],
            directory: './trash',
            };
        scrape(options).then((result) => {
            parse(i).then((message) => {
            resolve("Success");
            });
        });
    })
}

function flush(){
    fs.rmSync('./trash', {recursive: true, force: true});
    return Promise.resolve("Success");
}

function space(str, max){
    var res = "";
    for (var i = 0; i < max - str.length; i++){
        res = res + " ";
    }
    return res;
}
function parse(i){
    return new Promise((resolve) => {
        const html = fs.readFileSync('./trash/index.html','UTF-8').split(/\r?\n/);
        console.log(bdd['user'][i]['name'] + space(bdd['user'][i]['name'], 20) ,html[167].slice(14) + space(html[167].slice(14),13), "(" + (i + 1) + "/" + nbUser + ')');
        switch(html[167].slice(14)){
            case "Iron 1":
                bdd['user'][i]['rank'] = 1;
                savebdd();
                break;
            case "Iron 2":
                bdd['user'][i]['rank'] = 2;
                savebdd();
                break;
            case "Iron 3":
                bdd['user'][i]['rank'] = 3;
                savebdd();
                break;
            case "Bronze 1":
                bdd['user'][i]['rank'] = 4;
                savebdd();
                break;
            case "Bronze 2":
                bdd['user'][i]['rank'] = 5;
                savebdd();
                break;
            case "Bronze 3":
                bdd['user'][i]['rank'] = 6;
                savebdd();
                break;
            case "Silver 1":
                bdd['user'][i]['rank'] = 7;
                savebdd();
                break;
            case "Silver 2":
                bdd['user'][i]['rank'] = 8;
                savebdd();
                break;
            case "Silver 3":
                bdd['user'][i]['rank'] = 9;
                savebdd();
                break;
            case "Gold 1":
                bdd['user'][i]['rank'] = 10;
                savebdd();
                break;
            case "Gold 2":
                bdd['user'][i]['rank'] = 11;
                savebdd();
                break;
            case "Gold 3":
                bdd['user'][i]['rank'] = 12;
                savebdd();
                break;
            case "Platinum 1":
                bdd['user'][i]['rank'] = 13;
                savebdd();
                break;
            case "Platinum 2":
                bdd['user'][i]['rank'] = 14;
                savebdd();
                break;
            case "Platinum 3":
                bdd['user'][i]['rank'] = 15;
                savebdd();
                break;
            case "Diamond 1":
                bdd['user'][i]['rank'] = 16;
                savebdd();
                break;
            case "Diamond 2":
                bdd['user'][i]['rank'] = 17;
                savebdd();
                break;
            case "Diamond 3":
                bdd['user'][i]['rank'] = 18;
                savebdd();
                break;
            default:
                bdd['user'][i]['rank'] = 0;
                savebdd();
                break;
        }
        flush().then((message) => {
            return resolve("Success");
        });  
    })
}

function update(k){
    return new Promise((resolve) => {
        if (k > nbUser - 1){
            return resolve();
        }
        else{
            var fill = bdd['user'][k]['tracker'];
            getRank(fill,k).then((message) => {return resolve(update(k + 1))},
            (value) => {});
        }
    })
}

function display(){
    const channel = client.channels.cache.get (discordChannel);
    channel.bulkDelete(1);
    var n = 0;
    sort();
    const exampleEmbed = new MessageEmbed().setColor('#0099ff')
    .setTitle('FLB Ranking').setTimestamp();
    for (var i = 1; i <= (bdd["user"].length)/3; i++){
        exampleEmbed.addFields(
            { name: bdd["user"][n]["name"], value: "<:" + bdd['emote'][(bdd["user"][n]["rank"])]['name'] + ":" + bdd['emote'][(bdd["user"][n]["rank"])]['id'] +">", inline: true },
            { name: bdd["user"][n + 1]["name"], value: "<:" + bdd['emote'][(bdd["user"][n +1]["rank"])]['name'] + ":" + bdd['emote'][(bdd["user"][n+1]["rank"])]['id'] +">", inline: true },
        )
        .addField(bdd["user"][n + 2]["name"],"<:" + bdd['emote'][(bdd["user"][n+2]["rank"])]['name'] + ":" + bdd['emote'][(bdd["user"][n+2]["rank"])]['id'] +">", true);
        n = n + 3;
    }
    for (var i = 0; i < (bdd["user"].length % 3); i++){
        exampleEmbed.addFields(
            { name: bdd["user"][n]["name"], value: "<:" + bdd['emote'][(bdd["user"][n]["rank"])]['name'] + ":" + bdd['emote'][(bdd["user"][n]["rank"])]['id'] +">", inline: true },
        );
        n = n + 1;
    }
    exampleEmbed.setFooter({text: version});
    channel.send({ embeds: [exampleEmbed] });
}

function main(){
    console.clear();
    console.log("Fetching from https://tracker.gg/valorant :\n");
    update(0).then(() => {display();});
}