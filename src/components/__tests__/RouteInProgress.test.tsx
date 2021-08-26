import React from 'react';
import RouteInProgress from '../molecules/RouteInProgress';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';

describe('RouteInProgress test', () => {
  test('snapshot test', () => {
    const tree = mount(<RouteInProgress taskRoute={[]} />);
    expect(tree).toMatchSnapshot();
  });
});
