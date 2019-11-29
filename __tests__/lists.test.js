const app = require('../src/app');
const supertest = require('supertest');

const req = supertest(app);

describe('GET /lists', () => {
  it('List all lists', async done => {
    const res = await req.get('/api/lists');
    expect(res.status).toBe(200);
    done();
  });
});

let board = {
  name: 'QUADRO DE TESTE PARA LISTAS',
  description: 'DESCRICAO',
};
let list = {
  name: 'LISTA DE TESTE',
  description: 'DESCRICAO',
};
describe('POST /lists', () => {
  it('Create a new board', async done => {
    const res = await req.post('/api/boards').send(board);
    board = res.body;
    list._board = board._id;
    expect(res.status).toBe(201);
    done();
  });

  it('Create a new list', async done => {
    const res = await req.post('/api/lists').send(list);
    list = res.body;
    expect(res.status).toBe(201);
    done();
  });
});

describe('GET /lists/:id', () => {
  it(`Show list: ${list.name}`, async done => {
    const res = await req.get(`/api/lists/${list._id}`);
    expect(res.status).toBe(200);
    done();
  });
});

describe('PATCH /lists/:id', () => {
  it(`Update list: ${list.name}`, async done => {
    const res = await req
      .patch(`/api/lists/${list._id}`)
      .send({ ...list, name: 'ATUALIZAÇÃO' });
    list = res.body;
    expect(res.status).toBe(200);
    done();
  });
});

describe('DELETE /lists/:id', () => {
  it(`Delete list: ${list.name}`, async done => {
    const res = await req.delete(`/api/lists/${list._id}`);
    expect(res.status).toBe(200);
    done();
  });
});
