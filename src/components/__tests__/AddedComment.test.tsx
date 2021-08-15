import React from 'react';
import AddedComment from '../organisms/AddedComment';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import 'jsdom-global/register';
import { RecoilRoot } from 'recoil';

describe('BasicInfo test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <AddedComment setComment={onChangeMock} />
      </RecoilRoot>,
    );
  });

  test('input test', () => {
    container.find('textarea').simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });
});
