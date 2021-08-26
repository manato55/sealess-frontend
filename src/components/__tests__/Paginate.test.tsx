import React from 'react';
import Paginate from '../molecules/Paginate';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';

describe('Paginate test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = shallow(<Paginate contents={[]} perPage={3} offset={3} change={onChangeMock} />);
  });

  test('onChange test', () => {
    const input = container.find('#paginate');
    input.simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
