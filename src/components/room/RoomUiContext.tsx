// src/components/room/RoomUiContext.tsx
import * as React from 'react';

type RoomUiContextValue = {
    roomId?: string;
    settingsOpen: boolean;
    notesOpen: boolean;
    enterRoom: (roomId: string) => void;
    exitRoom: () => void;
    openSettings: () => void;
    closeSettings: () => void;
    toggleSettings: () => void;
    openNotes: () => void;
    closeNotes: () => void;
    toggleNotes: () => void;
};

const RoomUiContext = React.createContext<RoomUiContextValue | undefined>(undefined);

export function RoomUiProvider({ children }: { children: React.ReactNode }) {
    const [roomId, setRoomId] = React.useState<string | undefined>(undefined);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [notesOpen, setNotesOpen] = React.useState(false);

    const enterRoom = React.useCallback((nextId: string) => {
        setRoomId(nextId);
    }, []);

    const exitRoom = React.useCallback(() => {
        setRoomId(undefined);
        setSettingsOpen(false);
        setNotesOpen(false);
    }, []);

    const openSettings = React.useCallback(() => setSettingsOpen(true), []);
    const closeSettings = React.useCallback(() => setSettingsOpen(false), []);
    const toggleSettings = React.useCallback(() => setSettingsOpen((prev) => !prev), []);

    const openNotes = React.useCallback(() => setNotesOpen(true), []);
    const closeNotes = React.useCallback(() => setNotesOpen(false), []);
    const toggleNotes = React.useCallback(() => setNotesOpen((prev) => !prev), []);

    const value = React.useMemo(
        () => ({
            roomId,
            settingsOpen,
            notesOpen,
            enterRoom,
            exitRoom,
            openSettings,
            closeSettings,
            toggleSettings,
            openNotes,
            closeNotes,
            toggleNotes
        }),
        [
            roomId,
            settingsOpen,
            notesOpen,
            enterRoom,
            exitRoom,
            openSettings,
            closeSettings,
            toggleSettings,
            openNotes,
            closeNotes,
            toggleNotes
        ]
    );

    return <RoomUiContext.Provider value={value}>{children}</RoomUiContext.Provider>;
}

export function useRoomUi() {
    const context = React.useContext(RoomUiContext);
    if (!context) {
        throw new Error('useRoomUi must be used within a RoomUiProvider');
    }
    return context;
}
