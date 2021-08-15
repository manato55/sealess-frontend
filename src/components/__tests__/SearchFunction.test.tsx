import React, {LegacyRef} from 'react';
import renderer from 'react-test-renderer';
import SearchFunction from '../organisms/SearchFunction';
import { RecoilRoot } from 'recoil';
import { mount, shallow } from 'enzyme';
import { render, fireEvent } from '@testing-library/react';
import 'jsdom-global/register';
import { renderHook, act } from '@testing-library/react-hooks';


describe('SearchFunction test', () => {
  const onChangeMockTask = jest.fn();
  const onChangeMockName = jest.fn();
  const onChangeMockYear = jest.fn();
  let container;
  const useRefSpy: any = jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

  beforeEach(() => {
    container = mount(
      <RecoilRoot>
        <SearchFunction
          setTask={onChangeMockTask}
          setName={onChangeMockName}
          setSelectedJapYear={onChangeMockYear}
          fiscalYear={[]}
          taskRef={useRefSpy}
          nameRef={useRefSpy}
          yearRef={useRefSpy}
        />
      </RecoilRoot>,
    );
  });

  test('input task test', () => {
    const input = container.find('#task');
    input.simulate('change');
    expect(onChangeMockTask).toHaveBeenCalledWith('foo');
  });

  test('input name test', () => {
    const input = container.find('#name');
    input.simulate('change');
    expect(onChangeMockName).toHaveBeenCalledWith('foo');
  });

  test('select year test', () => {
    const input = container.find('#year');
    input.simulate('change');
    expect(onChangeMockYear).toHaveBeenCalledWith('foo');
  });

  test('snapshot', () => {
    expect(container).toMatchSnapshot();
  });

});
