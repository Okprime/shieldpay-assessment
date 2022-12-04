
 interface PayloadWithTopicArn {
    Message: string;
    TopicArn: string
}

 interface PayloadWithPhoneNumber {
    Message: string;
    PhoneNumber: string
}

 interface PublishToAQueuePayload {
    phoneNumber: string;
    messageBody: string;
}

export { PayloadWithTopicArn, PayloadWithPhoneNumber, PublishToAQueuePayload };
