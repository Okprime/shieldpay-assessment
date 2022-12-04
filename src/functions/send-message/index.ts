import { handlerPath } from '@libs/handler-resolver';

export const sendMessage = {
    handler: `${handlerPath(__dirname)}/handler.sendMessageViaSNS`,
    events: [
      {
        sqs: {
            arn: {
              "Fn::GetAtt": ["shieldPaySQS", "Arn"]
          }
        }
      }
    ]
};



 