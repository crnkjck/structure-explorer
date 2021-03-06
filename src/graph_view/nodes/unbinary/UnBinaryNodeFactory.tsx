import { UnBinaryNodeWidget } from './UnBinaryNodeWidget';
import { UnBinaryNodeModel } from './UnBinaryNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class UnBinaryNodeFactory extends AbstractReactFactory<UnBinaryNodeModel, DiagramEngine> {
	constructor() {
		super('unbinary');
	}

	generateReactWidget(event:any): JSX.Element {
		let reduxProps = event.model.options.reduxProps;
		return <UnBinaryNodeWidget checkBadName={reduxProps["checkBadName"]} removeDomainNode={reduxProps["removeDomainNode"]} renameDomainNode={reduxProps["renameDomainNode"]} engine={this.engine} size={50} node={event.model}/>;
	}

	generateModel(event:any) {
		return new UnBinaryNodeModel();
	}
}
