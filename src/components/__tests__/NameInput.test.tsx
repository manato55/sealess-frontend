import React from 'react';
import NameInput from '../molecules/NameInput';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';

describe('NameInput test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <NameInput setName={onChangeMock} name={'foo'} />
      </RecoilRoot>,
    );
  });

  test('input test', () => {
    const input = container.find('input');
    input.simulate('change');
    expect(onChangeMock).toHaveBeenCalledWith('foo');
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
