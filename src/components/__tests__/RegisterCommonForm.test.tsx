import React from 'react';
import RegisterCommonForm from '../molecules/RegisterCommonForm';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import { RecoilRoot } from 'recoil';

describe('RegisterCommonForm test', () => {
  let container;
  const onChangeMockEmail = jest.fn();
  const onChangeMockPassword = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <RegisterCommonForm
          setEmail={onChangeMockEmail}
          setPassword={onChangeMockPassword}
          email={'test@test.com'}
          password={'testtest'}
        />
      </RecoilRoot>
    );
  });

  test('email input test', () => {
    container.find('input[type="email"]').simulate('change');
    expect(onChangeMockEmail).toHaveBeenCalledWith('test@test.com');
  });

  test('password input test', () => {
    container.find('input[type="password"]').simulate('change');
    expect(onChangeMockPassword).toHaveBeenCalledWith('testtest');
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
