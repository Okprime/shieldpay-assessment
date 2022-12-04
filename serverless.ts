import type { AWS } from '@serverless/typescript';
import { receiveRequest } from '@functions/receive-request';
import { sendMessage } from '@functions/send-message';

const serverlessConfiguration: AWS = {
  service: 'shieldpay-assessment',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements:[
          {
            Effect: "Allow",
            Action: [
              "sns:SetSMSAttributes",
              "sns:Publish"
            ],
            Resource: "*"
          },
          {
            Effect: "Allow",
            Action: [
              "sqs:ListQueues",
            ],
            Resource: "*"
          },
        ],
      },

    },
    
  },
  // import the function via paths
  functions: { receiveRequest, sendMessage },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },

  resources: {
    Resources: {
      shieldPaySNS: {
      Type : "AWS::SNS::Topic",
      Properties : {
          TopicName : 'shieldpay-topic',
          Subscription : [ 
            {
              Endpoint : {
                "Fn::GetAtt": ["shieldPaySQS", "Arn"],
              },
              Protocol : 'sqs'
            }
           ],
          }      
      },
      shieldPaySQS: {
      Type : "AWS::SQS::Queue",
      Properties : {
          QueueName : 'shieldpay-queue',
          }      
      },
      SnsToSqsPolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                "Sid": "Allow SNS publish to SQS",
                "Effect": "Allow",
                "Principal": {
                  "Service": "sns.amazonaws.com"
                },
                "Action": "SQS:SendMessage",
                Resource: {
                  "Fn::GetAtt": ["shieldPaySQS", "Arn"],
                },
                "Condition": {
                  "ArnEquals": {
                    "aws:SourceArn": {
                      "Ref": "shieldPaySNS"
                    }
                  }
                }
              }
            ]
          },
          Queues: [
            {
              Ref: "shieldPaySQS"
            }
          ]
        },
      }
    }
  }
};

module.exports = serverlessConfiguration;
