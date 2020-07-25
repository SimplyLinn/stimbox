import { Component } from 'react';

export abstract class BoxComponent extends Component {
  public abstract readonly BoxName: string;
}

export type MetaData = {
  name: string;
  moduleName: string;
  description: string;
};
