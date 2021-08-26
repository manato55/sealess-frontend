import React from 'react';
import AdditiveInProgress from '../molecules/AdditiveInProgress';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import { act } from 'react-dom/test-utils';

describe('AdditiveInProgress test', () => {
  let container;

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <AdditiveInProgress filename={'testFile'} taskId={3} />
      </RecoilRoot>
    );
  });

  test('click test', () => {
    // const adds = require('../organisms/AdditiveInProgress');
    // jest.spyOn(adds, 'default');
    // container.find('li').simulate('click');
    // adds.default();
    // expect(adds).toHaveBeenCalled();
  });

  test('snapshot test', () => {
    expect(container).toMatchSnapshot();
  });
});
