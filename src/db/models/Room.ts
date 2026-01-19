import { GameModel, type GameDocument, type Game } from './Game';

export const RoomModel = GameModel;
export type RoomDocument = GameDocument;
export type Room = Game;
export type RoomId = Game['_id'];
