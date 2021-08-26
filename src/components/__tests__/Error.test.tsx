import React from 'react';
import Error from '../organisms/Error';
import 'jsdom-global/register';
import renderer from 'react-test-renderer';

describe('error test', () => {
  test('snapshot 404', () => {
    const tree = renderer.create(<Error errorCode={404} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('snapshot 500', () => {
    const tree = renderer.create(<Error errorCode={500} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
