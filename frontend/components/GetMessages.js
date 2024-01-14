'use server'
import { Client } from 'yb-ycql-driver';

export default async function GetMessages() {
'use server'

    
    
    const client = new Client({
      contactPoints: ['127.0.1.1'],
      localDataCenter: 'datacenter1'
    });

    await client.connect();
    
    const createKeyspaceQuery = "CREATE KEYSPACE IF NOT EXISTS messages_keyspace WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };";
    await client.execute(createKeyspaceQuery);
    
    client.keyspace = 'messages_keyspace';
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Messages (
        id UUID,
        channelId UUID,
        message TEXT,
        senderName TEXT,
        senderAvatar TEXT,
        createdAt TIMESTAMP,
        senderId TEXT,
        PRIMARY KEY (channelId, createdAt)
      ) WITH CLUSTERING ORDER BY (createdAt DESC);
    `;
    await client.execute(createTableQuery);
    
    const selectQuery = 'SELECT * FROM Messages WHERE channelId = ? LIMIT 50;';
    const params2 = ['8c7ab412-59a7-4652-b016-83457a73732c'];
    const result = await client.execute(selectQuery, params2, { prepare: true });
  
    const messages = result.rows.map(row => {
      const values = row.values();
      return {
          channelId: values[0].toString(),
          createdAt: values[1],
          id: values[2].toString(),
          message: values[3],
          sendername: values[4],
          senderAvatar: values[5],
          senderid: values[6],
      };
   });
    
    await client.shutdown();
    return messages;
}