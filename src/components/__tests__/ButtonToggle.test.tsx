import React from 'react';
import renderer from 'react-test-renderer';
import ButtonToggle from '../organisms/ButtonToggle';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';
import Button from '../atoms/Button'

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  return {
    ...originReact,
    useRef: (arg) =>
      typeof arg === 'undefined' ? { current: { getBoundingClientRect: () => ({ checked: true }) } } : { current: {checked: false} },
  };
});

describe('ButtonToggle test', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  let container;
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <ButtonToggle />
        </ThemeProvider>
      </RecoilRoot>,
    );
  });

  test('toggle test', () => {
    // console.log(container.debug())
    const input = container.find('#checkBox');
    input.simulate('change');
    expect(onSubmitMock).toHaveBeenCalled();
  });
});
