import styled from 'styled-components'
import { useRecoilState } from 'recoil'
import Input from '../atoms/Input'
import { isNavToggle } from '../../store/atom'
import React,{useRef,useEffect} from 'react'
import useMedia from 'use-media';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'



const ButtonToggle = () => {
    const [isNav, setIsNav] = useRecoilState(isNavToggle);
    const CheckRef = useRef<HTMLInputElement>(null)
    const breakPoint = useMedia({minWidth: '1000px'});

    useEffect(() => {
        if(breakPoint) {
            setIsNav(true)
            CheckRef.current.checked = true
        } else {
            setIsNav(false)
            CheckRef.current.checked = false
        }
    }, [breakPoint,setIsNav])


    const checkboxHandler = (): void => {
        setIsNav(CheckRef.current.checked)
    }

    return (
        <>
            <Toggler>
                <Input 
                    type='checkbox'
                    onChange={checkboxHandler}
                    ref={CheckRef}
                    id="checkBox"
                    visible={true}
                />
                <label htmlFor="checkBox">
                    {isNav
                    ? <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
                    : <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
                    }
                </label>
            </Toggler>
        </>
    )
}

const Toggler = styled.i`
    font-family: 'themify';
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    flex: 1;
    margin: auto 0;
    padding-left: 10px;
    content: "\e65e";
`;


export default React.memo(ButtonToggle)