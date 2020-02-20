import './App.css';
import React from 'react';
import {Col, Row, Modal, Button, ButtonToolbar} from 'react-bootstrap';
import {createStore} from 'redux';
import reducer from './reducers';
import {Provider} from 'react-redux';
import ExpressionsContainer from './containers/ExpressionsContainer';
import VariablesValueContainer from "./containers/VariablesValueContainer";
import LanguageContainer from './containers/LanguageContainer';
import StructureContainer from './containers/StructureContainer';
import DownloadButton from './components/lib/DownloadButton';
import {toggleTeacherMode} from "./actions";
import Toggle from 'react-toggle';
import FontAwesome from 'react-fontawesome';
import {importAppState} from "./actions";
import {DEFAULT_FILE_NAME} from "./constants";
import {Application} from "./diagram/Application";
import DiagramModelContainer from "./containers/DiagramModelContainer";

// @ts-ignore
const store = createStore(reducer);

// po kazdej zmene stavu sa vypise
store.subscribe(() => {
  let state = store.getState();
  console.log('STATE:', state);
  console.log('DIAGRAM:', state.diagramModel);
});

interface IProps{

}

interface IState {
  modalShow:boolean;
  diagramToggled:boolean;
  exerciseName:string;
}


class App extends React.Component<IProps,IState> {

  constructor(props:IProps) {
    super(props);

    this.state = {
      modalShow: false,
      diagramToggled:true,
      exerciseName:''
    };

    this.exportState = this.exportState.bind(this);
    this.importState = this.importState.bind(this);
  }


  exportState() {
    let state = store.getState();
    let json = JSON.stringify({
      common: state.common,
      language: state.language,
      structure: state.structure,
      expressions: state.expressions
    });

    if (this.state.exerciseName.length === 0) {
      //@ts-ignore
      this.state.exerciseName = DEFAULT_FILE_NAME;
    }

      return {
        mime: 'application/json',
        filename: this.state.exerciseName + '.json',
        contents: json
      }
    }

  importState(e:any) {
    let file = e.target.files[0];
    let fr = new FileReader();
    fr.onload = function (e) {
      // @ts-ignore
      store.dispatch(importAppState(e.target.result));
    };
    fr.readAsText(file);
  }

  render() {
    return (
        <Provider store={store}>
          <div className='app'>
            <Row>
              <div className='toolbar'>
                <div className='col-xs-7 toolbar-import-export'>
                  <ButtonToolbar>
                    <button className='btn btn-lock' onClick={() => this.setState({diagramToggled: false})}>
                      <FontAwesome name='bars'/>
                    </button>

                    <button className='btn btn-lock' onClick={() =>this.setState({diagramToggled: true})}>
                      <FontAwesome name='sitemap'/>
                    </button>

                    <button className='btn btn-lock' onClick={() => this.setState({modalShow: true})}>
                      <FontAwesome name='download'/>
                      <span className='toolbar-btn-label-1'>Uložiť</span>
                      <span className='toolbar-btn-label-2'>cvičenie</span>
                    </button>

                    <label className="btn btn-lock">
                      <FontAwesome name='upload'/>
                      <span className='toolbar-btn-label-1'>Importovať</span>
                      <span className='toolbar-btn-label-2'>cvičenie</span>
                      <input type="file" name='jsonFile'
                             onChange={e => this.importState(e)}
                             hidden={true}
                             style={{display: 'none'}}/>
                    </label>
                  </ButtonToolbar>
                </div>
                <div className='col-xs-5 toolbar-mode-toggle'>
                  <label className='teacher-mode'>
                    <Toggle
                        defaultChecked={store.getState().teacherMode}
                        onChange={() => store.dispatch(toggleTeacherMode())}/>
                    <span className='teacher-mode-span'>Učiteľský mód</span>
                  </label>
                </div>
               <Modal show={this.state.modalShow} onHide={() => this.setState({modalShow: false})}>
                  <Modal.Header>
                    <Modal.Title>Uložiť štruktúru</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className='form-inline'>
                      <div className='form-group'>
                        <label className='exercise-name-label' htmlFor="exercise-name">Cvičenie: </label>
                        <input type="text" className="exercise-name-input form-control" id="exercise-name"
                               placeholder={DEFAULT_FILE_NAME}
                               onChange={(e) => this.setState({exerciseName: e.target.value})}/>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <DownloadButton genFile={this.exportState} downloadTitle='Uložiť'
                                    className='btn btn-success'/>
                    <Button bsStyle='primary' onClick={() => this.setState({modalShow: false})}>Zrušiť</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Row>

              {!this.state.diagramToggled? (
                  <Row>
                    <Col sm={6}>
                      <LanguageContainer/>
                      <VariablesValueContainer/>
                    </Col>
                    <Col sm={6}>
                      <StructureContainer/>
                    </Col>
                  </Row>):
                    <Col sm={12} className='reactDiagram'>
                      <DiagramModelContainer app={new Application(store.getState().diagramModel)}/>
                    </Col>
              }
            <Row>
              <Col sm={12}>
                <ExpressionsContainer/>
              </Col>
            </Row>
          </div>
        </Provider>
    );
  }
}

export default App;
