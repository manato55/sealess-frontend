import React from 'react';
import renderer from 'react-test-renderer';
import Email from '../molecules/Email';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';

describe('Email test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <Email setEmail={onChangeMock} email={'foo'} />
      </RecoilRoot>
    );
  });

  test('input test', () => {
    // console.log(container.debug())
    const input = container.find('input');
    input.simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });
});
