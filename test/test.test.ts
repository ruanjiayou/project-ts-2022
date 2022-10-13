import { test, describe, expect, it, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest'
import mongoose from 'mongoose'
import app, { prepare } from '../src/app'

describe('test', () => {
  beforeAll(async () => {
    await prepare()
  })
  afterAll(async () => {
    await mongoose.disconnect()
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 500)
    })
  })
  it('hello world', async () => {
    const resp = await request(app.callback()).get('/').expect(200);
    expect(resp.text).toBe('Hello World!')
  })
})