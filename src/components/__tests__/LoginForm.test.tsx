import React from 'react';
import renderer from 'react-test-renderer';
import LoginForm from '../organisms/LoginForm';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook } from '@testing-library/react-hooks';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import { useAuthenticate } from '../../hooks/useAuth';
import { act, renderRecoilHook } from 'react-recoil-hooks-testing-library';

jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: string }): JSX.Element => {
    return <a href={href}>{children}</a>;
  };
  return Link;
});

describe('LoginForm test', () => {
  let container;
  const onChangeMockEmail = jest.fn();
  const onChangeMockPassword = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <LoginForm
            setEmail={onChangeMockEmail}
            setPassword={onChangeMockPassword}
            email={'foo'}
            password={'foo'}
          />
        </ThemeProvider>
      </RecoilRoot>
    );
  });

  test('input test', () => {
    const input = container.find('input[type="email"]');
    input.simulate('change', { target: { value: 'test' } });
    expect(onChangeMockEmail).toHaveBeenCalledWith('test');
  });

  test('input test', () => {
    const input = container.find('input[type="password"]');
    input.simulate('change');
    expect(onChangeMockPassword).toHaveBeenCalled();
  });

  test('login test', async () => {
    const mockObj = {
      password: 'testtest',
      email: 'test@test.com',
    };
    const { result } = renderRecoilHook(useAuthenticate);
    const form = container.find('form');
    form.simulate('submit', { preventDefault() {} });
    await act(async () => {
      await result.current.login(mockObj);
    });
    // expect().toHaveBeenCalled();
  });
});
