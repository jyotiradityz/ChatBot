import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice";
import { createChatSlide } from "./slices/chat-slice";

export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlide(...a),
}));


