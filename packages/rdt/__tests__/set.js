// @flow

import Op, {UUID, Batch, Frame} from 'swarm-ron';
import {reduce} from '../src';
import {ron2js} from '../src/set';

test('Set reduce', () => {
  const fixtures = [
    ['*set#test1@1!@=1', '*set#test1@2:1;', '*set#test1@2!:1,'],
    ['*set#test1@3:1;', '*set#test1@4:2;', '*set#test1@4:d!:2,@3:1,'],
    ['*set#test1@2!@=2@1=1', '*set#test1@5!@=5@3:2,@4:1,', '*set#test1@5!=5@3:2,@4:1,'],
    ['*set#test1@2!@=2@1=1', '*set#test1@3!@:2,@4:1,', '*set#test1@5!@=5', '*set#test1@5!=5@3:2,@4:1,'],
    ['*set#test1@3!@:2,@4:1,', '*set#test1@5!@=5', '*set#test1@2!@=2@1=1', '*set#test1@2!@5=5@3:2,@4:1,'],
    ['*set#test1@1=1', '*set#test1@2=2', '*set#test1@2:d!:0=2@1=1'],
  ];

  for (const fixt of fixtures) {
    const output = new Frame(fixt.pop());
    const reduced = reduce(Batch.fromStringArray(...fixt));
    expect(reduced.toString()).toBe(output.toString());
  }
});

test('Set map to js', () => {
  expect(ron2js('*set#test1@2:d!:0=2@1=1')).toEqual({'0': 2, '1': 1, _id: 'test1', length: 2});
  expect(ron2js('*set#test1@3:d!:0>object@2=2@1=1')).toEqual({
    '0': UUID.fromString('object'),
    '1': 2,
    '2': 1,
    _id: 'test1',
    length: 3,
  });
  expect(ron2js('*set#test1@3:d!:0>object@2=2#test@1=1#test1@=3')).toEqual({
    '0': UUID.fromString('object'),
    '1': 2,
    '2': 3,
    _id: 'test1',
    length: 3,
  });
});
