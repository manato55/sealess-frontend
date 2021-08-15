import React from 'react';
import renderer from 'react-test-renderer';
import TableContents from '../molecules/TableContents';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';

describe('TableContents test', () => {
  test('snapshot', () => {
    const tree = renderer.create(<TableContents tasks={[]} th={[]} pathName={'test'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
