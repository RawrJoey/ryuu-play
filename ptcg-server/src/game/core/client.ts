import { Game } from "./game";
import { User } from "../../storage";
import { Core } from "./core";
import { Prompt } from "../store/prompts/prompt";
import { State } from "../store/state/state";

export abstract class Client {

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
  
  public abstract onGameJoin(client: Client, game: Game): void;
  
  public abstract onGameLeave(client: Client, game: Game): void;

  public abstract onGameInfo(game: Game): void;

  public abstract onGameAdd(game: Game): void;

  public abstract onGameDelete(game: Game): void;

  public abstract onStateStable(game: Game, state: State): void;
  
  public abstract onStateChange(game: Game, state: State): void;

  public abstract resolvePrompt(game: Game, prompt: Prompt<any>): boolean;

}
