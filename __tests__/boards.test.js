const supertest = require('supertest');
const app = require('../src/app');

const req = supertest(app);

// Login
const user = {
  name: 'Test',
  email: 'test@test.com',
  password: 'test123',
};

let token = { Authorization: '' };
it('Do user login', async done => {
  const res = await req.post('/api/authenticate').send(user);
  token.Authorization = `Bearer ${res.body.token}`;
  done();
});

const BOARD_TO_BE_CREATED = {
  name: 'QUADRO DE TESTE',
  description: 'DESCRICAO',
};
let newBoard = null;
// CREATE
describe('POST /boards', () => {
  it('Creates a new board', async done => {
    const res = await req
      .post('/api/boards')
      .send(BOARD_TO_BE_CREATED)
      .set(token);
    newBoard = res.body;
    console.log(newBoard);
    // Check the status code
    expect(res.status).toBe(201);
    // Check de body response
    expect(newBoard._id).not.toBeNull();
    expect(newBoard.name).toBe(BOARD_TO_BE_CREATED.name);
    expect(newBoard.description).toBe(BOARD_TO_BE_CREATED.description);
    expect(newBoard.lists.length).toBe(0);
    expect(newBoard.createdAt).not.toBeNull();
    expect(newBoard.updatedAt).not.toBeNull();
    done();
  });
});
// SHOW
describe('GET /boards/:id', () => {
  it('Shows the board', async done => {
    const res = await req.get(`/api/boards/${newBoard._id}`).set(token);
    const showBoard = res.body;
    // Check the status code
    expect(res.status).toBe(200);
    // Check de body response
    expect(showBoard._id).toBe(newBoard._id);
    expect(showBoard.name).toBe(newBoard.name);
    expect(showBoard.description).toBe(newBoard.description);
    expect(showBoard.lists.length).toBe(newBoard.lists.length);
    expect(new Date(showBoard.createdAt).getTime()).toBe(
      new Date(newBoard.createdAt).getTime()
    );
    expect(new Date(showBoard.updatedAt).getTime()).toBe(
      new Date(newBoard.updatedAt).getTime()
    );
    done();
  });
});
// UPDATE
const BOARD_TO_BE_UPDATED = {
  name: 'NOME ATUALIZADO',
  description: 'DESCRICAO ATUALIZADA',
};
let updatedBoard = null;
describe('PATCH /boards/:id', () => {
  it('Updates the board', async done => {
    const res = await req
      .patch(`/api/boards/${newBoard._id}`)
      .set(token)
      .send(BOARD_TO_BE_UPDATED);
    updatedBoard = res.body;
    // Check the status code
    expect(res.status).toBe(200);
    // Check de body response
    expect(updatedBoard._id).toBe(newBoard._id);
    expect(updatedBoard.name).toBe(BOARD_TO_BE_UPDATED.name);
    expect(updatedBoard.description).toBe(BOARD_TO_BE_UPDATED.description);
    expect(updatedBoard.lists.length).toBe(newBoard.lists.length);
    expect(new Date(updatedBoard.createdAt).getTime()).toBe(
      new Date(newBoard.createdAt).getTime()
    );
    expect(new Date(updatedBoard.updatedAt).getTime()).not.toBe(
      new Date(newBoard.updatedAt).getTime()
    );
    done();
  });
});
// List
describe('GET /boards', () => {
  it('Lists all boards', async done => {
    const res = await req.get('/api/boards').set(token);
    const allBoards = res.body;
    const lastBoard = allBoards.pop();
    // Check the status code
    expect(res.status).toBe(200);
    // Check de body response
    expect(allBoards).not.toBeNull();
    expect(lastBoard._id).toBe(updatedBoard._id);
    expect(lastBoard.name).toBe(updatedBoard.name);
    expect(lastBoard.description).toBe(updatedBoard.description);
    expect(lastBoard.lists.length).toBe(updatedBoard.lists.length);
    expect(new Date(lastBoard.createdAt).getTime()).toBe(
      new Date(updatedBoard.createdAt).getTime()
    );
    expect(new Date(lastBoard.updatedAt).getTime()).toBe(
      new Date(updatedBoard.updatedAt).getTime()
    );
    done();
  });
});
// Delete
describe('DELETE /boards/:id', () => {
  it('Delete the board', async done => {
    const res = await req.delete(`/api/boards/${updatedBoard._id}`).set(token);
    const deletedBoard = res.body;
    // Check the status code
    expect(res.status).toBe(200);
    // Check de body response
    expect(deletedBoard._id).toBe(updatedBoard._id);
    expect(deletedBoard.name).toBe(updatedBoard.name);
    expect(deletedBoard.description).toBe(updatedBoard.description);
    expect(deletedBoard.lists.length).toBe(updatedBoard.lists.length);
    expect(new Date(deletedBoard.createdAt).getTime()).toBe(
      new Date(updatedBoard.createdAt).getTime()
    );
    expect(new Date(deletedBoard.updatedAt).getTime()).toBe(
      new Date(updatedBoard.updatedAt).getTime()
    );
    done();
  });
});
