import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');

        // Drop the old unique index on 'name' if it exists
        try {
            const companyCollection = mongoose.connection.collection('companies');
            const indexes = await companyCollection.listIndexes().toArray();

            // Check if old unique index on 'name' exists
            const oldIndex = indexes.find(idx => idx.name === 'name_1');
            if (oldIndex) {
                console.log('Dropping old unique index on name...');
                await companyCollection.dropIndex('name_1');
                console.log('Old index dropped successfully');
            }
        } catch (indexError) {
            console.log('Index check/drop info:', indexError.message);
        }
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;