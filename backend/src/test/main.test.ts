/* eslint-disable import/no-extraneous-dependencies */
import { randomUUID } from 'node:crypto';
import supertest from 'supertest';
import { afterEach, describe, it } from 'vitest';
import app from '../app.js';
import { UserRoleEnum } from '../drizzle/schema.js';

describe.sequential('main', () => {
  const api = supertest(app);
  const password = randomUUID().replace(/-/g, '');
  let adminToken = '';
  let token = '';
  let adminBookId: number;
  afterEach(async () => {
    await new Promise((res) => {
      setImmediate(res);
    });
  });

  it('Smoke test', async ({ expect }) => {
    const res = await api.get('/api/').expect(200).expect('Content-Type', /json/);
    expect(res.body).toEqual({ message: 'Hello, BookExchange here, what do you want to do?' });
  });

  it('Able to get books', async ({ expect }) => {
    const res = await api.get('/api/book').expect(200).expect('Content-Type', /json/);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(0);
  });
  it('Able to register', async ({ expect }) => {
    const res = await api
      .post('/api/user')
      .send({
        name: "'; DROP TABLE users; --",
        password,
        stuNum: '114514000',
        college: '下北泽',
        class: '1145',
      })
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body.token).toBeTruthy();
    expect(res.body.info.password).toBeUndefined();
    expect(res.body.info.role).toBe(UserRoleEnum.admin);
  });

  describe.sequential("Other users' behavior", () => {
    describe.concurrent('Student number and admin', () => {
      it('Other user should not be have the same stuNum', async ({ expect }) => {
        const res = await api
          .post('/api/user')
          .send({
            name: '李田所',
            password,
            stuNum: '114514000',
            college: '下北泽',
            class: '1145',
          })
          .expect(409);
        expect(res.body).toEqual({});
      });
      it('Other user should not be admin', async ({ expect }) => {
        const res = await api
          .post('/api/user')
          .send({
            name: '李田所',
            password,
            stuNum: '114514001',
            college: '下北泽',
            class: '1145',
          })
          .expect(200)
          .expect('Content-Type', /json/);
        expect(res.body.token).toBeTruthy();
        expect(res.body.info.password).toBeUndefined();
        expect(res.body.info.role).toBe(UserRoleEnum.default);
      });
    });
    it('Able to login', async ({ expect }) => {
      const res = await api
        .post('/api/auth/login')
        .send({
          stuNum: '114514001',
          password,
        })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body.token).toBeTruthy();
      token = res.body.token;
    });
    it('Able to submit book', async ({ expect }) => {
      const res = await api
        .post('/api/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '東方文花帖',
          desc: '东方文花帖',
          author: 'ZUN',
          tags: ['东方', 'STG'],
          img: '',
        })
        .expect(201)
        .expect('Content-Type', /json/);
      expect(res.body.title).toBe('東方文花帖');
      expect(res.body.desc).toBe('东方文花帖');
      expect(res.body.author).toBe('ZUN');
      expect(res.body.tags).toEqual(['东方', 'STG']);
      expect(res.body.img).toBe('');
      expect(res.body.id).toBeTruthy();
    });
    let bookId: number;
    it('Able to get books', async ({ expect }) => {
      const res = await api
        .get('/api/book')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(1);
      bookId = res.body[0].id;
    });
    describe.concurrent('Permission test', () => {
      it('Default user unable to get book by id', async ({ expect }) => {
        const res = await api.get(`/api/book/${bookId}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(401);
      });
      it('Default user should not be able to mark book as orderable', async ({ expect }) => {
        const res = await api.post(`/api/book/ordering`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(401);
      });
      it('Default user should not be able to mark book as received', async ({ expect }) => {
        const res = await api
          .get(`/api/book/${bookId}/receive`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(401);
      });
      describe.sequential('Create book, then delete', () => {
        let bookIdTmp: number;
        it('Submit book', async ({ expect }) => {
          const res = await api
            .post('/api/book')
            .set('Authorization', `Bearer ${token}`)
            .send({
              title: '東方文花帖',
              desc: '东方文花帖',
              author: 'ZUN',
              tags: ['东方', 'STG'],
              img: '',
            })
            .expect(201)
            .expect('Content-Type', /json/);
          expect(res.body.title).toBe('東方文花帖');
          expect(res.body.desc).toBe('东方文花帖');
          expect(res.body.author).toBe('ZUN');
          expect(res.body.tags).toEqual(['东方', 'STG']);
          expect(res.body.img).toBe('');
          expect(res.body.id).toBeTruthy();
          bookIdTmp = res.body.id;
        });
        it('Default user should be able to their book', async ({ expect }) => {
          const res = await api
            .delete(`/api/book/${bookIdTmp}`)
            .set('Authorization', `Bearer ${token}`);
          expect(res.status).toBe(204);
        });
      });
    });
    it('Able to logout', async ({ expect }) => {
      const res = await api
        .get('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
      expect(res.body).toEqual({});
    });
    it('Unable to submit book after logout', async ({ expect }) => {
      const res = await api
        .post('/api/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: '東方文花帖',
          desc: '东方文花帖',
          author: 'ZUN',
          tags: ['东方', 'STG'],
          img: '',
        });
      expect(res.status).toBe(401);
    });
  });

  describe.sequential("Admin users' behavior", () => {
    it('Able to login', async ({ expect }) => {
      const res = await api
        .post('/api/auth/login')
        .send({
          stuNum: '114514000',
          password,
        })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body.token).toBeTruthy();
      adminToken = res.body.token;
    });
    let bookId: number;
    it('Able to get books', async ({ expect }) => {
      const res = await api
        .get('/api/book')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(1);
      bookId = res.body[0].id;
    });

    describe.concurrent('Permission test', () => {
      it('Admin user should be able to get book by id', async ({ expect }) => {
        const res = await api
          .get(`/api/book/${bookId}`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.body.id).toBe(bookId);
        expect(res.body.owner.id).toBe(2);
        expect(res.status).toBe(200);
      });
      it('Admin user should be able to mark book as orderable', async ({ expect }) => {
        const res = await api
          .post(`/api/book/ordering`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
      });
      it('Admin user should be able to mark book as not orderable', async ({ expect }) => {
        const res = await api
          .delete(`/api/book/ordering`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
      });
    });
    it('Able to mark book as received', async ({ expect }) => {
      const res = await api
        .get(`/api/book/${bookId}/receive`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
    it('Should not be able to order book for now', async ({ expect }) => {
      const res = await api
        .patch(`/api/book/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
    });
    it('Should be able to delete book', async ({ expect }) => {
      const res = await api
        .delete(`/api/book/${bookId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
    });
    it('Able to submit book', async ({ expect }) => {
      const res = await api
        .post('/api/book')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: '東方文花帖',
          desc: '东方文花帖',
          author: 'ZUN',
          tags: ['东方', 'STG'],
          img: '',
        })
        .expect(201)
        .expect('Content-Type', /json/);
      expect(res.body.title).toBe('東方文花帖');
      expect(res.body.desc).toBe('东方文花帖');
      expect(res.body.author).toBe('ZUN');
      expect(res.body.tags).toEqual(['东方', 'STG']);
      expect(res.body.img).toBe('');
      expect(res.body.id).toBeTruthy();
      adminBookId = res.body.id;
    });
    it('Able to mark book as received', async ({ expect }) => {
      const res = await api
        .get(`/api/book/${adminBookId}/receive`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });
  });

  describe.sequential('Other users behavior 2', () => {
    it('Able to login', async ({ expect }) => {
      const res = await api
        .post('/api/auth/login')
        .send({
          stuNum: '114514001',
          password,
        })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(res.body.token).toBeTruthy();
      token = res.body.token;
    });
  });
});
