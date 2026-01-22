// src/components/townsquare/TownSquareLayout.tsx
import * as React from 'react';
import { TownSquareBoard } from './TownSquareBoard';
import { TownSquareMenu } from './TownSquareMenu';
import { TownSquareIntro } from './TownSquareIntro';
import { TownSquareInfo } from './TownSquareInfo';
import { TownSquareVote } from './TownSquareVote';
import { TownSquareGradients } from './TownSquareGradients';
import { TownSquareModalHost, type TownSquareModalKind } from './TownSquareModalHost';

export function TownSquareLayout() {
    const [modalKind, setModalKind] = React.useState<TownSquareModalKind | null>(null);

    const handleOpenModal = (kind: TownSquareModalKind) => {
        setModalKind(kind);
    };

    const handleCloseModal = () => setModalKind(null);

    return (
        <div
            className='relative flex min-h-screen flex-col overflow-hidden text-white'
            // style={{
            //     backgroundImage: `url(${tokensDeskBackground})`,
            //     backgroundSize: 'cover',
            //     backgroundPosition: 'center',
            //     backgroundRepeat: 'no-repeat'
            // }}
        >
            <TownSquareGradients />
            <div className='relative z-10 flex flex-1 flex-col gap-6 px-4 py-6 lg:px-10'>
                <div className='flex items-start justify-between gap-4'>
                    <TownSquareIntro />
                    <TownSquareInfo onOpenModal={handleOpenModal} />
                </div>
                <div className='flex flex-col gap-6 lg:flex-row'>
                    <div className='flex-1'>
                        <TownSquareVote />
                    </div>
                    <div className='flex-1 lg:max-w-sm'>
                        <TownSquareMenu onOpenModal={handleOpenModal} />
                    </div>
                </div>
                <TownSquareBoard />
            </div>
            <TownSquareModalHost
                modalKind={modalKind}
                onClose={handleCloseModal}
            />
        </div>
    );
}
