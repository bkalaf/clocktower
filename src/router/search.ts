export type NightCardType =
    | 'you_are_evil'
    | 'you_are_good'
    | 'make_a_choice'
    | 'use_your_ability'
    | 'these_characters_are_out_of_play'
    | 'these_are_your_minions'
    | 'this_is_the_demon'
    | 'you_are';

export type ModalKind = 'invites' | 'reveal' | 'nightCards' | 'preferences';

export type RootSearch = {
    modal?: ModalKind;
    type?: NightCardType;
};
