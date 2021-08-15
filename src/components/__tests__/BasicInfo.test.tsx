import React from 'react';
import renderer from 'react-test-renderer';
import BasicInfo from '../molecules/BasicInfo';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import 'jsdom-global/register';

describe('BasicInfo test', () => {
  let container;
  const onChangeMock = jest.fn();

  beforeEach(() => {
    container = mount(
      <BasicInfo setTitle={onChangeMock} setContents={onChangeMock} title={''} contents={''} editable={false} />,
    );
  });

  test('input test', () => {
    container.find('input').simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });

  test('textarea test', () => {
    container.find('textarea').simulate('change');
    expect(onChangeMock).toHaveBeenCalled();
  });
});
