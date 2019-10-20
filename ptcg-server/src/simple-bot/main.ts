import { Bot } from '../game/bots/bot';
import { GameRoom, GameClient } from '../game/rooms/game-room';
import { LobbyRoom, LobbyClient } from '../game/rooms/lobby-room';
import { SimpleGameHandler } from './simple-game-handler';
import { User } from '../storage';


export class SimpleBot implements Bot {

  private client: LobbyClient;
  private gameHandlers: SimpleGameHandler[] = [];

  constructor(
    public user: User,
    public lobbyRoom: LobbyRoom
  ) {
    this.client = this.lobbyRoom.join(user);
  }

  public createGame(): GameClient {
    const client = this.lobbyRoom.createGame(this.client);
    return this.addGameHandler(client);
  }

  public joinGame(gameId: number): GameClient {
    const game = this.lobbyRoom.getGame(gameId);
    if (game === undefined) {
      throw new Error('ERROR_GAME_NOT_FOUND');
    }
    const client = game.join(this.client);
    return this.addGameHandler(client);
  }

  private addGameHandler(client: GameClient): GameClient {
    const gameHandler = new SimpleGameHandler(client);
    this.gameHandlers.push(gameHandler);
    client.on('game:destroy', () => this.deleteGameHandler(gameHandler));
    return client;
  }

  private deleteGameHandler(gameHandler: SimpleGameHandler): void {
    const index = this.gameHandlers.indexOf(gameHandler);
    if (index !== -1) {
      this.gameHandlers.splice(index, 1);
    }
  }

  public playGame(client: GameClient, deck: string[]): void {
    const gameRoom: GameRoom = client.room;
    gameRoom.play(client, deck);
  }

}
