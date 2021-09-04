import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import Input from '../atoms/Input';
import { isNavToggle } from '../../store/atom';
import React, { useRef, useEffect, useCallback } from 'react';
import useMedia from 'use-media';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const ButtonToggle = (): React.ReactElement => {
  const [isNav, setIsNav] = useRecoilState(isNavToggle);
  const CheckRef = useRef<HTMLInputElement>(null);
  const breakPoint = useMedia({ minWidth: '800px' });

  useEffect(() => {
    if (breakPoint) {
      setIsNav(true);
      CheckRef.current.checked = true;
    } else {
      setIsNav(false);
      CheckRef.current.checked = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakPoint]);

  const checkboxHandler = useCallback((): void => {
    setIsNav(CheckRef.current.checked);
  }, []);

  return (
    <>
      <Wrapper>
        <Input
          type="checkbox"
          onChange={checkboxHandler}
          ref={CheckRef}
          id="checkBox"
          visible={true}
        />
        <label htmlFor="checkBox">
          {isNav ? (
            <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
          ) : (
            <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
          )}
        </label>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  margin: auto 0;
  padding-left: 10px;
`;

export default React.memo(ButtonToggle);
