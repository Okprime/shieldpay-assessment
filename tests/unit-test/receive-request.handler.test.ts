import { APIGatewayProxyEvent } from "aws-lambda";
import { receivePOSTRequest } from "../../src/functions/receive-request/handler";

describe('receivePOSTRequest', function () {
    it('should return a success message when a valid phone number and a message body is passed', async () => {
        const event: APIGatewayProxyEvent = {
            body:"{\n \"phoneNumber\": \"+447405404898\",\n \"messageBody\": \"Test\"\n}",
        } as any
        const result = await receivePOSTRequest(event)

        expect(result.statusCode).toEqual(200);

    });

    it('should throw an error when neither phoneNumber nor messageBody is passed', async () => {
        const event: APIGatewayProxyEvent = {
            "body":"{\n \"phoneNumber\": \"\",\n \"messageBody\": \"\"\n}",
        } as any
        const result = await receivePOSTRequest(event)
        console.log('result - 2', result);


        expect(result.statusCode).toEqual(400);
    });

    it('should throw an error when an invalid phoneNumber is passed', async () => {
        const event: APIGatewayProxyEvent = {
            body:"{\n \"phoneNumber\": \"447405404898\",\n \"messageBody\": \"Test\"\n}",
        } as any
        const result = await receivePOSTRequest(event)
        const phoneNumberForTestSake = '447405404898'

        console.log('result - 3', result);


        expect(result.statusCode).toEqual(400);
    });
});
