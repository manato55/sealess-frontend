import React from 'react';
import Label from '../molecules/Label';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';
import renderer from 'react-test-renderer';
import { withHooks } from 'jest-react-hooks-shallow';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/history',
    };
  },
}));

describe('Label test', () => {
  test('snapshot', () => {
    const tree = renderer.create(<Label path={'test'} tagName={'foo'} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
