import styled from 'styled-components';
import { useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';

type Props = {
  setSwitchVal: Dispatch<SetStateAction<boolean>>;
  isEnabled: boolean;
};

export const OnOffBtn = (props: Props) => {
  const agentRef = useRef<HTMLInputElement>(null);

  // 初期状態で有効の場合はチェックボックスONにする。
  useEffect(() => {
    if (props.isEnabled == true) {
      agentRef.current.checked = true;
    }
  }, [props.isEnabled]);

  return (
    <SwitchArea>
      <input type="checkbox" id="switch1" onChange={(e) => props.setSwitchVal(e.target.checked)} ref={agentRef} />
      <label htmlFor="switch1">
        <span></span>
      </label>
      <div id="swImg"></div>
    </SwitchArea>
  );
};

const SwitchArea = styled.div`
  line-height: 60px; /* 1行の高さ          */
  letter-spacing: 0; /* 文字間             */
  text-align: center; /* 文字位置は中央     */
  font-size: 27px; /* 文字サイズ         */
  position: relative; /* 親要素が基点       */
  margin: auto; /* 中央寄せ           */
  width: 150px; /* ボタンの横幅       */
  background: #fff; /* デフォルト背景色   */

  input[type='checkbox'] {
    display: none; /* チェックボックス非表示 */
  }

  label {
    display: block; /* ボックス要素に変更 */
    box-sizing: border-box; /* 枠線を含んだサイズ */
    height: 60px; /* ボタンの高さ       */
    border: 2px solid #999999; /* 未選択タブのの枠線 */
    border-radius: 30px; /* 角丸               */
  }

  input[type='checkbox']:checked + label {
    border-color: #78bd78; /* 選択タブの枠線     */
  }

  label span:after {
    content: 'OFF'; /* 表示する文字       */
    padding: 0 0 0 36px; /* 表示する位置       */
    color: #999999; /* 文字色             */
  }

  input[type='checkbox']:checked + label span:after {
    content: 'ON'; /* 表示する文字       */
    padding: 0 36px 0 0; /* 表示する位置       */
    color: #78bd78; /* 文字色             */
  }

  #swImg {
    position: absolute; /* 親要素からの相対位置*/
    width: 52px; /* 丸の横幅           */
    height: 52px; /* 丸の高さ           */
    background: #999999; /* カーソルタブの背景 */
    top: 4px; /* 親要素からの位置   */
    left: 4px; /* 親要素からの位置   */
    border-radius: 26px; /* 角丸               */
    transition: 0.2s; /* 滑らか変化         */
  }

  input[type='checkbox']:checked ~ #swImg {
    transform: translateX(90px); /* 丸も右へ移動       */
    background: #78bd78; /* カーソルタブの背景 */
  }
`;

export default OnOffBtn;
