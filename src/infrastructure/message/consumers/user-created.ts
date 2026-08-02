import {UserObject} from "../../../contracts/proto/auth";

export async function userCreated(topic: string, partition: number, message: UserObject): Promise<void> {
    // try {
    //     await upsert(message.id);
    // } catch (error) {
    //     logger.error(`[Kafka] Failed to process message`, {
    //         rawValue: message.id,
    //         error,
    //     });
    // }
}
