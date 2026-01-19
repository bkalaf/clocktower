// src/components/townsquare/TownSquareModalHost.tsx
import * as React from 'react';
import { EditionModal } from './modals/EditionModal';
import { FabledModal } from './modals/FabledModal';
import { GameStateModal } from './modals/GameStateModal';
import { NightOrderModal } from './modals/NightOrderModal';
import { ReferenceModal } from './modals/ReferenceModal';
import { ReminderModal } from './modals/ReminderModal';
import { RoleModal } from './modals/RoleModal';
import { RolesModal } from './modals/RolesModal';
import { VoteHistoryModal } from './modals/VoteHistoryModal';

export type TownSquareModalKind =
    | 'edition'
    | 'roles'
    | 'fabled'
    | 'nightOrder'
    | 'reference'
    | 'reminder'
    | 'gameState'
    | 'role'
    | 'voteHistory';

type Props = {
    modalKind: TownSquareModalKind | null;
    onClose: () => void;
};

export function TownSquareModalHost({ modalKind, onClose }: Props) {
    return (
        <>
            <EditionModal open={modalKind === 'edition'} onOpenChange={(open) => !open && onClose()} />
            <FabledModal open={modalKind === 'fabled'} onOpenChange={(open) => !open && onClose()} />
            <GameStateModal open={modalKind === 'gameState'} onOpenChange={(open) => !open && onClose()} />
            <NightOrderModal open={modalKind === 'nightOrder'} onOpenChange={(open) => !open && onClose()} />
            <ReferenceModal open={modalKind === 'reference'} onOpenChange={(open) => !open && onClose()} />
            <ReminderModal open={modalKind === 'reminder'} onOpenChange={(open) => !open && onClose()} />
            <RoleModal open={modalKind === 'role'} onOpenChange={(open) => !open && onClose()} />
            <RolesModal open={modalKind === 'roles'} onOpenChange={(open) => !open && onClose()} />
            <VoteHistoryModal open={modalKind === 'voteHistory'} onOpenChange={(open) => !open && onClose()} />
        </>
    );
}
