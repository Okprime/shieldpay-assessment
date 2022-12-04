import { handlerPath } from '@libs/handler-resolver';

export const receiveRequest = {
    handler: `${handlerPath(__dirname)}/handler.receivePOSTRequest`,
    events: [
        {
            http: {
                method: 'post',
                path: 'receive-request',
                cors: true,
            },
        },
    ],
};



