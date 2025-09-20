import create from "zustand";

export const useCourtStore = create((set, get) => ({
  playerId: null,
  role: null,
  players: [],
  logs: [],
  courtProtocol: { standing: false, sessionActive: false },

  // ✅ الإجراءات
  setPlayer: (id, role) => set({ playerId: id, role }),
  setPlayers: (players) => set({ players }),
  setCourtProtocol: (protocol) => set({ courtProtocol: protocol }),

  addLog: (msg) =>
    set((state) => ({
      logs: [
        ...state.logs.slice(-9),
        `[${new Date().toLocaleTimeString()}] ${msg}`,
      ],
    })),
}));
