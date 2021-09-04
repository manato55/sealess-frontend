export type FailureType = {
  code: number;
  message?: string;
};

export class Success<T> {
  readonly isFailure = false;
  constructor(readonly value: T) {}
}

export class Failure {
  readonly isFailure = true;
  constructor(readonly error: FailureType) {}
}

export type Result<T> = Success<T> | Failure;
