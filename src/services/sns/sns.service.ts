import { PayloadWithPhoneNumber, PayloadWithTopicArn, PublishToAQueuePayload } from '@functions/types/types';
import { formatJSONResponse } from '../../libs/api-gateway';
import { SNS } from 'aws-sdk';

const sns = new SNS({ region: 'us-east-1' });

export const publishToAQueue = async (payload: PublishToAQueuePayload, arn?: string) => {
    try {
        if (arn) {
            const params: PayloadWithTopicArn = {
                Message: JSON.stringify(payload),
                TopicArn: arn
            };
            return sns.publish(params).promise();
        }
        const params: PayloadWithPhoneNumber = {
            Message: payload.messageBody,
            PhoneNumber: payload.phoneNumber,
        };

    return sns.publish(params).promise(); 
    } catch (error) {
        console.log('An error occured while publishing the message', error)
        return formatJSONResponse({
            status: 500,
            message: `An error occured while publishing the message: ${error}`
        }, 500);
    }
}
