import { MongoClient } from 'mongodb';
import { config } from './configData.js';

export async function getDbConnection() {
  const dbConnection = await new MongoClient(config.mongo.url).connect();
  return dbConnection;
}
