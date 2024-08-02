import clientPromise from '../lib/mongodb';

const CONSENT_ID_COLLECTION = 'consentIds';

const DbsService = {
  updateConsentId: async (consentId: string) => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection(CONSENT_ID_COLLECTION)

    // delete all
    await collection.deleteMany({});

    // add consent id
    await collection.updateOne({}, {
      $set: {consentId}
    });
    
    const row = collection.findOne({});
    return row;
  }
}

export default DbsService;
