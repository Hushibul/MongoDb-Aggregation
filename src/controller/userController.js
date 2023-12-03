import { config } from '../config/configData.js';
import { getDbConnection } from '../config/dbConnection.js';
const dbCollections = 'leaves';

export async function getAllUsers(req, res, next) {
  try {
    const dbConn = await getDbConnection();
    const db = dbConn.db(config.mongo.dbName);
    const dbCollection = db.collection(dbCollections);
    const result = await dbCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    await dbConn.close();

    res.status(200).json(result);
  } catch (error) {
    console.log('Error during database operation: ', error);
    throw error; // Rethrow the error to handle it at the caller's level
  }
}

export async function getUserByAggregation(req, res, next) {
  try {
    const dbConn = await getDbConnection();
    const db = dbConn.db(config.mongo.dbName);
    const dbCollection = db.collection(dbCollections);

    const agg = [
      {
        $lookup: {
          from: 'employee', // desired collection
          localField: 'employeeId', // the field of the desired in the current collection
          foreignField: '_id', // the field in the desired collection
          as: 'employeeData', // new field named
        },
      },
      {
        $unwind: '$employeeData', // getting out of the array
      },
      {
        $match: {
          $and: [
            { count: { $gt: 2 } }, // greater that condition
            { count: { $lt: 5 } },
            { leavePenalty: { $eq: 3 } },
          ],
        },
      },
      {
        $set: {
          // setting a new field in the table
          remainingLeave: {
            $subtract: [
              // making a subtract operation on them
              '$employeeData.totalLeave',
              '$employeeData.consumedLeave',
            ],
          },
        },
      },
      {
        $addFields: {
          // adding new field to the collection
          sickLeave: 10,
          familyLeave: 10,
        },
      },
      {
        $limit: 10, // limiting the of documents
      },
      // {
      //   $group: {
      //     _id: '$count',
      //     names: {
      //       $push: '$$ROOT',
      //     },
      //   },
      // },
      // {
      //   $match: {
      //     count: 3,
      //     type: 'Casual',
      //     leavePenalty: 0,
      //   },
      // },
      // {
      //   $project: {
      //     startDate: 1,
      //     endDate: 1,
      //     count: 1,
      //     name: '$employeeData.name',
      //   },
      // },
    ];

    const result = await dbCollection.aggregate(agg).toArray();
    await dbConn.close();

    res.status(200).json(result);
  } catch (error) {
    console.log('Error during database operation: ', error);
    throw error; // Rethrow the error to handle it at the caller's level
  }
}
