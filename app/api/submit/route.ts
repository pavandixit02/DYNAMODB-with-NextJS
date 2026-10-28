import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
})

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const { name, email, message } = body;
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: "All fields are required!"},
                { status: 400 }
            )
        }
        const command = new PutCommand({
            TableName: "Contact-Messages",
            Item: {
                id: uuidv4(),
                name,
                email,
                message,
                submittedAt: new Date().toISOString(),
            }
        })
        await client.send(command);
        return NextResponse.json({ message: "Form Submitted!"})
    }
    catch(error){
        console.error("DynamoDb Error: ", error);
        return NextResponse.json(
            { message: "Internal Server Error"},
            { status: 500 }
        )
    }
}