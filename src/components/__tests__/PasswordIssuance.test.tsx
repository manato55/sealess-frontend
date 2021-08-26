import React from 'react';
import PasswordIssuanceForm from '../organisms/PasswordIssuanceForm';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import { ThemeProvider } from 'styled-components';
import theme from '../../styles/theme';

describe('PasswordIssuanceForm test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <PasswordIssuanceForm setEmail={onChangeMock} email={'test@test.com'} />
        </ThemeProvider>
      </RecoilRoot>
    );
  });

  test('input test', () => {
    const input = container.find('input');
    input.simulate('change');
    expect(onChangeMock).toHaveBeenCalledWith('test@test.com');
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
