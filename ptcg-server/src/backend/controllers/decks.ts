import { Request, Response } from 'express';

import { AuthToken, Validate, check } from '../services';
import { CardManager, DeckAnalyser } from '../../game';
import { Controller, Get, Post } from './controller';
import { DeckSaveRequest } from '../interfaces';
import { Errors } from '../common/errors';
import { User, Deck } from '../../storage';

export class Decks extends Controller {

  @Get('/all')
  @AuthToken()
  public async onAll(req: Request, res: Response) {
    const userId: number = req.body.userId;
    const user = await User.findOne(userId, { relations: ['decks'] });

    if (user === undefined) {
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    const decks = user.decks.map(deck => ({
      id: deck.id,
      name: deck.name,
      cards: JSON.parse(deck.cards),
      isValid: deck.isValid,
      cardTypes: JSON.parse(deck.cardTypes)
    }));

    res.send({ok: true, decks});
  }

  @Post('/save')
  @AuthToken()
  @Validate({
    name: check().minLength(3).maxLength(32),
    cards: check().required()
  })
  public async onSave(req: Request, res: Response) {
    const body: DeckSaveRequest = req.body;

    // optional id parameter, without ID new deck will be created
    if (body.id !== undefined && typeof body.id !== 'number') {
      res.status(400);
      res.send({error: Errors.VALIDATION_INVALID_PARAM, param: 'id'});
      return;
    }

    // check if all cards exist in our database
    if (!this.validateCards(body.cards)) {
      res.status(400);
      res.send({error: Errors.VALIDATION_INVALID_PARAM, param: 'cards'});
      return;
    }

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    let deck = body.id !== undefined
      ? await Deck.findOne(body.id, { relations: ['user'] })
      : (() => { let d = new Deck(); d.user = user; return d; })();

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: Errors.DECK_INVALID});
      return;
    }

    const deckUtils = new DeckAnalyser(body.cards);
    deck.name = body.name;
    deck.cards = JSON.stringify(body.cards);
    deck.isValid = deckUtils.isValid();
    deck.cardTypes = JSON.stringify(deckUtils.getDeckType());
    deck = await deck.save();

    res.send({ok: true, deck: {
      id: deck.id,
      name: deck.name,
      cards: body.cards
    }});
  }

  @Post('/delete')
  @AuthToken()
  @Validate({
    id: check().isNumber()
  })
  public async onDelete(req: Request, res: Response) {
    const body: { id: number } = req.body;

    const userId: number = req.body.userId;
    const user = await User.findOne(userId);

    if (user === undefined) {
      res.status(400);
      res.send({error: Errors.PROFILE_INVALID});
      return;
    }

    const deck = await Deck.findOne(body.id, { relations: ['user'] });

    if (deck === undefined || deck.user.id !== user.id) {
      res.status(400);
      res.send({error: Errors.DECK_INVALID});
      return;
    }

    await deck.remove();

    res.send({ok: true});
  }

  private validateCards(deck: string[]) {
    if (!(deck instanceof Array)) {
      return false;
    }

    const cardManager = CardManager.getInstance();
    for (let i = 0; i < deck.length; i++) {
      if (typeof deck[i] !== 'string' || !cardManager.isCardDefined(deck[i])) {
        return false;
      }
    }

    return true;
  }

}
