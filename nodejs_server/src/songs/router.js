import Router from 'koa-router';
import songStore from './store';
import { broadcast } from "../utils";

export const router = new Router();

router.get('/', async (ctx) => {
  const response = ctx.response;
  const userId = ctx.state.user._id;
  const page = ctx.query.page;
  if (page){
    const rightLimit = 3 * page;
    const leftLimit = rightLimit - 3;
    response.body = Object.values(await songStore.find({ userId })).filter((_, i) => i < rightLimit && i >= leftLimit);
  }
  else{  
    response.body = await songStore.find({ userId });
  }
  
  response.status = 200; // ok
});

router.get('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const note = await songStore.findOne({ _id: ctx.params.id });
  const response = ctx.response;
  if (note) {
    if (note.userId === userId) {
      response.body = note;
      response.status = 200; // ok
    } else {
      response.status = 403; // forbidden
    }
  } else {
    response.status = 404; // not found
  }
});

const createSong = async (ctx, song, response) => {
  try {
    const userId = ctx.state.user._id;
    song.userId = userId;
    response.body = await songStore.insert(song);
    response.status = 201; // created
    broadcast(userId, { type: 'created', payload: song });
  } catch (err) {
    response.body = { message: err.message };
    response.status = 400; // bad request
  }
};

router.post('/', async ctx => await createSong(ctx, ctx.request.body, ctx.response));

router.put('/:id', async (ctx) => {
  const song = ctx.request.body;
  const id = ctx.params.id;
  const songId = song._id;
  const response = ctx.response;
  if (songId && songId !== id) {
    response.body = { message: 'Param id and body _id should be the same' };
    response.status = 400; // bad request
    return;
  }
  if (!songId) {
    await createSong(ctx, song, response);
  } else {
    const userId = ctx.state.user._id;
    song.userId = userId;
    const updatedCount = await songStore.update({ _id: id }, song);
    if (updatedCount === 1) {
      response.body = song;
      response.status = 200; // ok
      broadcast(userId, { type: 'updated', payload: song });
    } else {
      response.body = { message: 'Resource no longer exists' };
      response.status = 405; // method not allowed
    }
  }
});

router.del('/:id', async (ctx) => {
  const userId = ctx.state.user._id;
  const note = await songStore.findOne({ _id: ctx.params.id });
  if (note && userId !== note.userId) {
    ctx.response.status = 403; // forbidden
  } else {
    await songStore.remove({ _id: ctx.params.id });
    ctx.response.status = 204; // no content
  }
});
