import React from 'react';
import renderer from 'react-test-renderer';
import LoginForm from '../organisms/LoginForm';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';

jest.mock('next/link', () => {
  const Link = ({ href, children }: { href: string; children: string }): JSX.Element => {
    return <a href={href}>{children}</a>;
  };
  return Link;
});

describe('LoginForm test', () => {
  let container;
  const onChangeMock = jest.fn();
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <LoginForm setEmail={onChangeMock} setPassword={onChangeMock} email={'foo'} password={'foo'} />
        </ThemeProvider>
      </RecoilRoot>,
    );
  });

  test('login test', async () => {
    // console.log(container.debug())
    const input = container.find('form');
    input.simulate('submit');
    expect(onSubmitMock).toHaveBeenCalled();
  });
});
