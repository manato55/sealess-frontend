import React from 'react';
import LeftNav from '../organisms/LeftNav';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import renderer from 'react-test-renderer';


describe('LeftNav test', () => {
  let container;

  test('snapshot', async() => {
    container = await mount(
      <RecoilRoot>
        <LeftNav />
      </RecoilRoot>,
    );
    expect(container).toMatchSnapshot();
  });
});
