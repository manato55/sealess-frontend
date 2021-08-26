import React from 'react';
import renderer from 'react-test-renderer';
import LabelChoice from '../molecules/LabelChoice';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';

describe('LabelChoice test', () => {
  let container;
  const onClickMock = jest.fn();

  beforeEach(() => {
    container = shallow(
      <LabelChoice
        setCurrComponent={onClickMock}
        currComponent={'foo'}
        isComment={true}
        curr={'foo'}
      />
    );
  });

  test('click test', () => {
    const loop = ['basic', 'adds', 'route', 'comment'];
    for (let i of loop) {
      const span = container.find(`#${i}`);
      span.simulate('click', { target: { value: 'foo' } });
      expect(onClickMock).toHaveBeenCalled();
    }
  });
});
