import axios from "axios";

describe("Integration Test", () => {
    it("receive post request integration test", async () => {
        const body = {
            "phoneNumber": "447405404898",
            "messageBody": "Test"
        }
        try {
            const data = await axios.post(
              'http://localhost:3000/dev/receive-request',
                body,
            );
            console.log('dataaaa', data.data);

            return data;
          } catch (error) {
            console.log('An error occured when', error.response.data);
          }


        // expect(response.status).toEqual(200);
        // expect(response.data).toEqual(`Queries: ${JSON.stringify(query)}`);
    });
});