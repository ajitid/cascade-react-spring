import { ReactNode, ReactElement } from 'react';

export type WithChildren<P = {}> = P & { children: ReactNode };

export type WC<P = {}> = WithChildren<P>;

export interface FunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  displayName?: string;
}

export type FC<P = {}> = FunctionComponent<P>;
