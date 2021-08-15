import React from 'react';
import renderer from 'react-test-renderer';
import Email from './molecules/Email';
import { RecoilRoot } from 'recoil';
import { mount } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import 'jsdom-global/register';

// it('should call onChange prop', () => {
//   const onSearchMock = jest.fn();
//   const event = {
//     target: { value: 'the-value' }
//   } as React.ChangeEvent<HTMLInputElement>;
//   const component = enzyme.shallow(
//   <RecoilRoot>
//     <Email emailHandler={onSearchMock} setEmail={jest.fn()} email={'test'} />
//   </RecoilRoot>

//   );
//   component.find('input').simulate('change', event);
//   expect(onSearchMock).toBeCalledWith('the-value');
// });

describe('Index with enzyme', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(<Email setEmail={onChangeMock} email={'foo'} />);
  });

  test('Should set value to state when input is changed', () => {
    // console.log(container.debug())
    const input = container.find('input');
    input.simulate('change', { target: { value: 'foo' } });
    expect(onChangeMock).toHaveBeenCalled();
    // expect(input.prop('value')).toBe('foo');
  });

  test('Should set value to state when input is changed', () => {
    expect(container.find('#value').text()).toBe('0');
    // expect(input.prop('value')).toBe('foo');
  });

  test('Should set value to state when input is changed', () => {
    container.find('#incrememt-btn').simulate('click');
    expect(container.find('#value').text()).toBe('1');
    // expect(input.prop('value')).toBe('foo');
  });

  test('Should set value to state when input is changed', () => {
    container.find('#incrememt-btn').simulate('click');
    expect(container.find('#value').text()).toBe('1');
    container.find('#decrement-btn').simulate('click');
    expect(container.find('#value').text()).toBe('0');
    // expect(input.prop('value')).toBe('foo');
  });
});
