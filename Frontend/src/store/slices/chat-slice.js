export const createChatSlide = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMesseges: [],

    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMesseges: (selectedChatMesseges) => set({ selectedChatMesseges }),

    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMesseges: [] }),

    addMessage: (message) => {
        const selectedChatMesseges = get().selectedChatMesseges;
        const selectedChatType = get().selectedChatType;

        set({
            selectedChatMesseges: [
                ...selectedChatMesseges,
                {
                    ...message,
                    recipient: selectedChatType === "channel"
                        ? message.recipient
                        : message.recipient._id,
                    sender: selectedChatType === "channel"
                        ? message.sender
                        : message.sender._id,
                },
            ]
        });
    },
});