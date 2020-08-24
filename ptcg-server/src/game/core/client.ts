import { Game } from "./game";
import { User } from "../../storage";
import { Core } from "./core";
import { State } from "../store/state/state";

export abstract class Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public core: Core | undefined;
  public games: Game[] = [];
  
  constructor(user: User) {
    this.name = user.name;
    this.user = user;
  }

  public abstract onConnect(client: Client): void;

  public abstract onDisconnect(client: Client): void;

  public abstract onUsersUpdate(users: User[]): void;

  public abstract onGameAdd(game: Game): void;

  public abstract onGameDelete(game: Game): void;

  public abstract onGameJoin(game: Game, client: Client): void;

  public abstract onGameLeave(game: Game, client: Client): void;

  public abstract onStateChange(game: Game, state: State): void;

}
