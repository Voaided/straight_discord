'use server'

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v4 as uuidv4 } from 'uuid';
import { Client } from 'yb-ycql-driver';

export default async function SendMessage( message ) {
'use server'


const session = await getServerSession(authOptions);

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

const insertQuery = 'INSERT INTO Messages (id, channelId, message, senderName, senderAvatar, createdAt, senderId) VALUES (?, ?, ?, ?, ?, ?, ?)';
const params = [uuidv4(), '8c7ab412-59a7-4652-b016-83457a73732c', message, session.user.name, session.user.image, new Date(), session.user.id];

await client.execute(insertQuery, params, { prepare: true });

await client.shutdown();
}