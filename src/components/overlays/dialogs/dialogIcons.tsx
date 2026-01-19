// src/components/overlays/dialogs/dialogIcons.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDiceFive,
    faDiceFour,
    faDiceOne,
    faDiceSix,
    faDiceThree,
    faDiceTwo,
    faSquare,
    faThumbsDown,
    faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

export function getIcon(num: number) {
    function inner() {
        switch (num) {
            case 0:
                return faSquare;
            case 1:
                return faDiceOne;
            case 2:
                return faDiceTwo;
            case 3:
                return faDiceThree;
            case 4:
                return faDiceFour;
            case 5:
                return faDiceFive;
            case 6:
                return faDiceSix;
            default:
                throw new Error(`no number: ${num}`);
        }
    }
    const result = () => (
        <FontAwesomeIcon
            icon={inner()}
            size='5x'
            className='bg-blue-500 w-1/5 h-1/5 object-cover'
        />
    );
    result.displayName = 'Number';
    return result;
}

export function getBooleanIcon(shown: boolean) {
    return shown ?
            () => (
                <FontAwesomeIcon
                    icon={faThumbsUp}
                    size='5x'
                    className='bg-blue-500 w-1/5 h-1/5 object-cover'
                />
            )
        :   () => (
                <FontAwesomeIcon
                    icon={faThumbsDown}
                    size='5x'
                    className='bg-blue-500 w-1/5 h-1/5 object-cover'
                />
            );
}
