import React from 'react';
import Header from '../molecules/Header';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';
import renderer from 'react-test-renderer';
import { withHooks } from 'jest-react-hooks-shallow';

describe('header test', () => {
  test('snapshot', () => {
    const tree = renderer
      .create(
        <RecoilRoot>
          <Header />
        </RecoilRoot>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
