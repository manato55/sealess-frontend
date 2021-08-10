import React, {Dispatch, SetStateAction, LegacyRef} from 'react'
import ErrorMessageWrapper from '../atoms/ErrorMessageWrapper'

interface Props {
    inputError: string[];
    setTask: Dispatch<SetStateAction<string>>;
    setName: Dispatch<SetStateAction<string>>;
    setSelectedJapYear: Dispatch<SetStateAction<number>>;
    fiscalYear: number[];
    taskRef: LegacyRef<HTMLInputElement>;
    nameRef: LegacyRef<HTMLInputElement>;
    yearRef: LegacyRef<HTMLSelectElement>;
}

export const SearchFunction = (props: Props): React.ReactElement => {
    return (
        <>
            <ErrorMessageWrapper>{props.inputError !== undefined && props.inputError}</ErrorMessageWrapper>
            <p>案件名</p>
            <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setTask(e.target.value)}
                ref={props.taskRef}
            />
            <p>担当者名</p>
            <input
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.setName(e.target.value)}
                ref={props.nameRef}
            />
            <p>年度</p>
            <select 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => props.setSelectedJapYear(Number(e.target.value))} 
                defaultValue={'choice'}
                ref={props.yearRef} 
            >
                <option value="choice" disabled>選択してください</option>
                {props.fiscalYear?.map((year, index) => 
                    <option key={index} value={year}>令和{year}年度</option>
                )}
            </select>
        </>
    )
}


export default SearchFunction