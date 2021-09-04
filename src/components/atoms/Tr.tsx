import React from 'react';
import Link from 'next/link';
import { toDateWeek } from '../../lib/dateHelper';
import { CompletedTask } from '../../hooks/useComplete';

interface Props {
  task: CompletedTask;
  pathName: string;
}

export const Tr = (props: Props): React.ReactElement => {
  return (
    <>
      <tr>
        <td>
          <Link href={`/${props.pathName}/${props.task.id}`}>
            <a>{props.task.title}</a>
          </Link>
        </td>
        <td>
          {props.pathName === 'returned' ? (
            <span>
              {props.task.returned_task.user_id === props.task.user_id ? (
                <span>本人</span>
              ) : (
                <span>
                  {props.task.returned_task.user.section}&emsp;{props.task.returned_task.user.name}
                </span>
              )}
            </span>
          ) : props.pathName === 'unreached' ? (
            <span>{props.task.user.name}</span>
          ) : props.pathName === 'recieve' ? (
            <span>
              {props.task.user.section}&emsp;{props.task.user.name}
            </span>
          ) : props.pathName === 'history' ? (
            <span>{props.task[`${props.task.process}_user`].name}</span>
          ) : props.pathName === 'progress' ? (
            <span>
              {props.task[`${props.task.process}_user`]
                ? props.task[`${props.task.process}_user`].name
                : '削除ユーザー'}
            </span>
          ) : (
            ''
          )}
        </td>
        <td>
          {props.pathName === 'unreached' || props.pathName === 'progress'
            ? toDateWeek(props.task.created_at)
            : toDateWeek(props.task.updated_at)}
        </td>
      </tr>
    </>
  );
};

export default Tr;
