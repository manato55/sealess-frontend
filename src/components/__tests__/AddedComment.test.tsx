import React from 'react';
import AddedComment from '../molecules/AddedComment';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import { RecoilRoot } from 'recoil';

describe('BasicInfo test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <AddedComment setComment={onChangeMock} />
      </RecoilRoot>
    );
  });

  test('input test', () => {
    container.find('textarea').simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });
});
