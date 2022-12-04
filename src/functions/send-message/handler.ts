import { formatJSONResponse } from '@libs/api-gateway';
import { publishToAQueue } from 'src/services/sns/sns.service';

export const sendMessageViaSNS = async (event)=> {
    try {
        // format the response to get the phone number and the message
        const body = event.Records[0].body;
        const { phoneNumber, messageBody } = JSON.parse(JSON.parse(body).Message)

        // push data to SQS
        await publishToAQueue({ phoneNumber, messageBody })

        return formatJSONResponse({
            status: 200,
            message: 'SQS event processed.'
        }, 200);
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: `An error occured while sending message: ${e}`
        }, 200);
    }
}