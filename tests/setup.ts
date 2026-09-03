import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({
        replSet: {
            count: 1,
        },
    });

    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    process.env.JWT_SECRET = "test_secret";
}, 30000);

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
    }
}, 30000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}, 30000);
