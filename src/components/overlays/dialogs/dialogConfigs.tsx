// src/components/overlays/dialogs/dialogConfigs.tsx
import * as React from 'react';
import type { DialogDataMap, DialogType } from '@/store/types/ui-types';
import { getBooleanIcon, getIcon } from './dialogIcons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DialogContentProps<T extends DialogType> = {
    data: DialogDataMap[T];
};

type DialogConfig<T extends DialogType> = {
    title: string;
    description: string;
    Content: React.ComponentType<DialogContentProps<T>>;
};

const SetupCompleteContent: React.FC<DialogContentProps<'setupComplete'>> = () => null;

const RoleInfoContent: React.FC<DialogContentProps<'firstNightRoleInfo'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        <div className='flex'>{data.roleName}</div>
        <div className='flex'>{data.seatNames[0]}</div>
        <div className='flex'>{data.seatNames[1]}</div>
    </div>
);

const FortuneTellerInfoContent: React.FC<DialogContentProps<'fortunetellerInfo'>> = ({ data }) => {
    return getBooleanIcon(data.shown)();
};

const FortuneTellerChoiceContent: React.FC<DialogContentProps<'fortunetellerChoice'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        {['seat1', 'seat2'].map((name) => (
            <div
                className='flex'
                key={name}
            >
                <Select
                    name={name}
                    required
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Select a seat...' />
                    </SelectTrigger>
                    <SelectContent>
                        {data.seatOptions.map((seat) => (
                            <SelectItem
                                key={seat.id}
                                value={seat.id.toString()}
                            >
                                {seat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        ))}
    </div>
);

const ButlerChoiceContent: React.FC<DialogContentProps<'butlerChoice'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        <div className='flex'>
            <Select
                name='chosenSeat'
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder='Select a seat...' />
                </SelectTrigger>
                <SelectContent>
                    {data.seatOptions.map((seat) => (
                        <SelectItem
                            key={seat.id}
                            value={seat.id.toString()}
                        >
                            {seat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
);

const PoisonerChoiceContent: React.FC<DialogContentProps<'poisonerChoice'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        <div className='flex'>
            <Select
                name='seat'
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder='Select a seat...' />
                </SelectTrigger>
                <SelectContent>
                    {data.seatOptions.map((seat) => (
                        <SelectItem
                            key={seat.id}
                            value={seat.id.toString()}
                        >
                            {seat.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
);

const EmpathInfoContent: React.FC<DialogContentProps<'empathInfo'>> = ({ data }) => {
    return getIcon(data.count)();
};

const ChefInfoContent: React.FC<DialogContentProps<'chefInfo'>> = ({ data }) => {
    return getIcon(data.count)();
};

const MinionInfoContent: React.FC<DialogContentProps<'minionInfo'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        <div className='flex col-start-1'>Demons:</div>
        {data.demons.map((el) => (
            <div
                key={el.id}
                className='flex col-start-2'
            >
                Seat {el.id}: {el.name}
            </div>
        ))}
        <div className='flex col-start-1'>Minions:</div>
        {data.minions.map((el) => (
            <div
                key={el.id}
                className='flex col-start-2'
            >
                Seat {el.id}: {el.name}
            </div>
        ))}
    </div>
);

const DemonInfoContent: React.FC<DialogContentProps<'demonInfo'>> = ({ data }) => (
    <div className='grid grid-cols-2'>
        {data.bluffs.map((role) => (
            <div
                key={role}
                className='flex'
            >
                {role}
            </div>
        ))}
    </div>
);

export const dialogConfigs: { [K in DialogType]: DialogConfig<K> } = {
    butlerChoice: {
        title: 'Make a choice...',
        description: 'Choose your master',
        Content: ButlerChoiceContent
    },
    poisonerChoice: {
        title: 'Make a choice...',
        description: 'Select one player',
        Content: PoisonerChoiceContent
    },
    setupComplete: {
        title: 'Setup Complete',
        description: 'Start game?',
        Content: SetupCompleteContent
    },
    firstNightRoleInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: RoleInfoContent
    },
    librarianInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: RoleInfoContent as any as React.FC<DialogContentProps<'librarianInfo'>>
    },
    washerwomanInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: RoleInfoContent as any as React.FC<DialogContentProps<'washerwomanInfo'>>
    },
    investigatorInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: RoleInfoContent as any as React.FC<DialogContentProps<'investigatorInfo'>>
    },
    fortunetellerInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: FortuneTellerInfoContent
    },
    fortunetellerChoice: {
        title: 'Make a choice',
        description: 'Pick 2 different players.',
        Content: FortuneTellerChoiceContent
    },
    empathInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: EmpathInfoContent
    },
    chefInfo: {
        title: 'Night Info',
        description: 'You are shown:',
        Content: ChefInfoContent
    },
    minionInfo: {
        title: 'Evil Team Info',
        description: 'You are shown:',
        Content: MinionInfoContent
    },
    demonInfo: {
        title: 'Demon Bluffs',
        description: 'You are shown:',
        Content: DemonInfoContent
    }
};
