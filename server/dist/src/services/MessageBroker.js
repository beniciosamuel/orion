"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBroker = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
class MessageBroker {
    static instance = null;
    static getInstance() {
        if (!MessageBroker.instance) {
            MessageBroker.instance = new pubsub_1.PubSub();
        }
        else {
            console.info("PubSub instance already exists. Returning the existing instance.");
        }
        return MessageBroker.instance;
    }
    static async publish(topicName, data) {
        const instance = MessageBroker.getInstance();
        const dataBuffer = Buffer.from(JSON.stringify(data));
        try {
            await instance
                .topic(topicName)
                .publishMessage({ data: dataBuffer });
        }
        catch (error) {
            console.error(`Error publishing message to topic ${topicName}:`, error);
        }
    }
    static subscribe(topicName, messageHandler) {
        const instance = MessageBroker.getInstance();
        const subscription = instance.subscription(topicName);
        subscription.on("message", async (message) => {
            try {
                const data = JSON.parse(message.data.toString());
                await messageHandler(data);
                message.ack();
            }
            catch (error) {
                console.error(`Error processing message from subscription ${topicName}:`, error);
                message.nack();
            }
        });
        subscription.on("error", (error) => {
            console.error(`Error with subscription ${topicName}:`, error);
        });
    }
}
exports.MessageBroker = MessageBroker;
