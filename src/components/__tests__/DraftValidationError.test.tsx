import React from 'react';
import DraftValidataionError from '../molecules/DraftValidataionError';
import 'jsdom-global/register';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';

describe('DraftValidataionError test', () => {
  test('snapshot', () => {
    const tree = renderer
      .create(
        <RecoilRoot>
          <DraftValidataionError />
        </RecoilRoot>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
