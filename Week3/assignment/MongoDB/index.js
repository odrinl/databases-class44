require('dotenv').config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const { seedDatabase } = require("./seedDatabase.js");

function getClientDatabaseCollection(client) {
  const database = client.db('databaseWeek3');
  const collection = database.collection('bob_ross_episodes');
  return { database, collection };
}

async function createEpisodeExercise(client) {
   
    const { database, collection } = getClientDatabaseCollection(client);

    const episodeToAdd = {
    episode: 'S09E13',
    title: 'MOUNTAIN HIDE-AWAY',
    elements: [
      'CIRRUS',
      'CLOUDS',
      'CONIFER',
      'DECIDIOUS',
      'GRASS',
      'MOUNTAIN',
      'MOUNTAINS',
      'RIVER',
      'SNOWY_MOUNTAIN',
      'TREE',
      'TREES',
    ],
  };
    try {
    const result = await collection.insertOne(episodeToAdd);

    console.log(
      `Created season 9 episode 13 and the document got the id ${result.insertedId}`
    );
  } catch (err) {
    console.error(err);
  }
}

async function findEpisodesExercises(client) {
  try {
    const { collection } = getClientDatabaseCollection(client);

    // Find the title of episode 2 in season 2
    const episode2Season2 = await collection.findOne({ episode: "S02E02" });

    console.log(
      `The title of episode 2 in season 2 is ${episode2Season2 ? episode2Season2.title : "Not found"}`
    );

    // Find the season and episode number of the episode called "BLACK RIVER"
    const blackRiverEpisode = await collection.findOne({ title: "BLACK RIVER" });

    console.log(
      `The season and episode number of the "BLACK RIVER" episode is ${blackRiverEpisode ? blackRiverEpisode.episode : "Not found"}`
    );

    // Find all of the episode titles where Bob Ross painted a CLIFF
    const cliffEpisodes = await collection.find({ elements: "CLIFF" }).toArray();
    const cliffEpisodeTitles = cliffEpisodes.map((episode) => episode.title);

    console.log(
      `The episodes that Bob Ross painted a CLIFF are ${cliffEpisodeTitles.join(', ')}`
    );

    // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE
    const cliffAndLighthouseEpisodes = await collection.find({ elements: ["CLIFF", "LIGHTHOUSE"] }).toArray();
    const cliffAndLighthouseEpisodeTitles = cliffAndLighthouseEpisodes.map((episode) => episode.title);

    console.log(
      `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffAndLighthouseEpisodeTitles.join(', ')}`
    );
  } catch (err) {
    console.error(err);
  }
}

async function updateEpisodeExercises(client) {
  try {
    const { collection } = getClientDatabaseCollection(client);

    // Update the title of episode 13 in season 30
    const updateResult = await collection.updateOne(
      { episode: "S30E13" },
      { $set: { title: "BLUE RIDGE FALLS" } }
    );

    console.log(
      `Ran a command to update episode 13 in season 30 and it updated ${updateResult.modifiedCount} episodes`
    );

    // Update all occurrences of 'BUSHES' to 'BUSH'
    const updateBushesResult = await collection.updateMany(
      { elements: "BUSHES" },
      { $set: { "elements.$": "BUSH" } }
    );

    console.log(
      `Ran a command to update all the BUSHES to BUSH and it updated ${updateBushesResult.modifiedCount} episodes`
    );
  } catch (err) {
    console.error(err);
  }
}

async function deleteEpisodeExercise(client) {
  try {
    const { collection } = getClientDatabaseCollection(client);

    // Delete episode 14 in season 31
    const deleteResult = await collection.deleteOne({ episode: "S31E14" });

    console.log(
      `Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`
    );
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
