import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT,
    snsTopicArn: process.env.SNS_TOPIC_ARN,
}