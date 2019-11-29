const app = require('../src/app');
const supertest = require('supertest');

const req = supertest(app);

describe('GET /boards', () => {
  it('List all boards', async done => {
    const res = await req.get('/api/boards');
    expect(res.status).toBe(200);
    done();
  });
});

let board = {
  name: 'QUADRO DE TESTE',
  description: 'DESCRICAO',
};
describe('POST /boards', () => {
  it('Create a new board', async done => {
    const res = await req.post('/api/boards').send(board);
    board = res.body;
    expect(res.status).toBe(201);
    done();
  });
});

describe('GET /boards/:id', () => {
  it(`Show board: ${board.name}`, async done => {
    const res = await req.get(`/api/boards/${board._id}`);
    expect(res.status).toBe(200);
    done();
  });
});

describe('PATCH /boards/:id', () => {
  it(`Update board: ${board.name}`, async done => {
    const res = await req
      .patch(`/api/boards/${board._id}`)
      .send({ ...board, name: 'ATUALIZAÇÃO' });
    board = res.body;
    expect(res.status).toBe(200);
    done();
  });
});

describe('DELETE /boards/:id', () => {
  it(`Delete board: ${board.name}`, async done => {
    const res = await req.delete(`/api/boards/${board._id}`);
    expect(res.status).toBe(200);
    done();
  });
});
