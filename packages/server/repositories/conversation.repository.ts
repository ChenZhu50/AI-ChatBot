//this is a implementation detail, so we should not export it
const conversation = new Map<string, string>();

export const conversationRepository = {
   getLastResponseId(conversationId: string): string | undefined {
      return conversation.get(conversationId);
   },
   setLastResponseId(conversationId: string, responseId: string): void {
      conversation.set(conversationId, responseId);
   },
};

//export only the public interface
