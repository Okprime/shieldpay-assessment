import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '../../libs/api-gateway';
import { publishToAQueue } from "../../services/sns/sns.service";
import { parsePhoneNumber } from 'awesome-phonenumber'
import { config } from "../../libs/env";


export const receivePOSTRequest = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

      const { phoneNumber, messageBody } = JSON.parse(event.body);

        // ensure both fields are passed
        if (!phoneNumber || !messageBody) {
            return formatJSONResponse({
                status: 400,
                message: 'Missing phone number or messsage from the body'
            }, 400);
        }

        // ensure only a valid phone number is passed
        const { valid } = parsePhoneNumber(phoneNumber);

        if (!valid) {
            return formatJSONResponse({
                status: 400,
                message: `The phone number ${phoneNumber} passed is not valid`
            }, 400);
        }
    
        const TopicArn: string = config.snsTopicArn;

        // send this data to an SNS topic
        await publishToAQueue({ phoneNumber, messageBody }, TopicArn)

        return formatJSONResponse({
            status: 200,
            message: `A message has been sent to this number: ${phoneNumber}`
        }, 200);
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: `An error occured: ${e}`
        }, 500);
    }
}

