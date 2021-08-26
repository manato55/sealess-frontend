import React from 'react';
import RouteSetting from '../molecules/RouteSetting';
import { mount, shallow } from 'enzyme';
import 'jsdom-global/register';
import { RecoilRoot } from 'recoil';

describe('RouteSetting test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    const obj = {
      route: 'test',
      user: {
        name: 'test',
        department: 'test',
        section: 'test',
      },
      agent_user: 5,
    };
    container = mount(
      <RecoilRoot>
        <RouteSetting
          setPplInRoute={onChangeMock}
          pplInRoute={[]}
          process={3}
          isRegisteredRoute={true}
          agentStatus={[obj]}
        />
      </RecoilRoot>
    );
  });

  test('onChange test', () => {
    const select = container.find('#selected');
    select.simulate('change', { target: { value: 'test' } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });
});
