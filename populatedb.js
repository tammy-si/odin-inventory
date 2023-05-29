#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);
  
// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Platform = require("./models/platform");
const Studio = require("./models/studio");

const games = [];
const platforms = [];
const studios = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
console.log("Debug: About to connect");
await mongoose.connect(mongoDB);
console.log("Debug: Should be connected?");
await createStudios();
await createPlatforms();
await createGames();
console.log("Debug: Closing mongoose");
mongoose.connection.close();
}

async function studioCreate(name) {
    const studio = new Studio({ name: name });
    await studio.save();
    studios.push(studio);
    console.log(`Added studio: ${name}`);
}

async function platformCreate(name) {
    const platform = new Platform({ name: name });
    await platform.save();
    platforms.push(platform);
    console.log(`Added platform: ${name}`);
}

async function gamesCreate(title, studio, description, price, stock, platforms) {
    const gamedetail = {
        title: title,
        studio: studio,
        description: description,
        price: price,
        num_in_stock: stock,
    };
    if (platforms != false) gamedetail.platforms = platforms;

    const game = new Game(gamedetail);
    await game.save();
    games.push(game);
    console.log(`Added game: ${title}`);
}

async function createStudios() {
    console.log("Adding studios");
    await Promise.all([
        studioCreate("Nintendo"),
        studioCreate("Naughty Dog"),
        studioCreate("Rockstar Games"),
        studioCreate("Insomniac"),
    ]);
}

async function createPlatforms() {
console.log("Adding platforms");
    await Promise.all([
        platformCreate("Windows"),
        platformCreate("MacOS"),
        platformCreate("PS4"),
        platformCreate("Nintendo Switch"),
        platformCreate("XBOX"),
    ]);
}

async function createGames() {
console.log("Adding games");
await Promise.all([
    gamesCreate(
        "Spider-Man",
        studios[3],
        "Marvel's Spider-Man is an open-world third-person action-adventure game, in which the player controls Peter Parker, under his superhero identity Spider-Man, through Manhattan, New York City to fight crime.",
        40,
        2,
        [platforms[0], platforms[2]]
    ),
    gamesCreate(
        "The Legend of Zelda: Tears of the Kingdom",
        studios[0],
        "In this sequel to the Legend of Zelda: Breath of the Wild game, you'll decide your own path through the sprawling landscapes of Hyrule and the mysterious islands floating in the vast skies above.",
        69.99,
        3,
        [platforms[3]]
    ),
    gamesCreate(
        "Grand Theft Auto V",
        studios[2],
        "Grand Theft Auto V is an action-adventure game played from either a third-person or first-person perspective. Players complete missions—linear scenarios with set objectives—to progress through the story. Outside of the missions, players may freely roam the open world.",
        20,
        1,
        [platforms[0], platforms[2], platforms[4]]
    ),
    gamesCreate(
        "The Last of Us Part I",
        studios[1],
        "Players control Joel, a smuggler tasked with escorting a teenage girl, Ellie, across a post-apocalyptic United States. The Last of Us is played from a third-person perspective",
        69.99,
        2,
        [platforms[0], platforms[2]]
    ),
    gamesCreate(
        "The Last of Us Part II",
        studios[1],
        "Set five years after The Last of Us (2013), the game focuses on two playable characters in a post-apocalyptic United States whose lives intertwine: Ellie, who sets out in revenge for a murder, and Abby, a soldier who becomes involved in a conflict between her militia and a religious cult.",
        39.99,
        2,
        [platforms[2]]
    ),
    gamesCreate(
        "Animal Crossing New Horizons",
        studios[0],
        "In New Horizons, the player controls a character who moves to a deserted island after purchasing a getaway package from Tom Nook, accomplishes assigned tasks, and develops the island as they choose. They can gather and craft items, customize the island, and develop it into a community of anthropomorphic animals.",
        59.99,
        4,
        [platforms[3]]
    ),
]);
}
