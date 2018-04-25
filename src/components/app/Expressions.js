import React from 'react';
import {
   Button,
   Col,
   FormControl,
   FormGroup,
   HelpBlock,
   InputGroup,
   Panel,
   Row,
} from "react-bootstrap";
import {EXPRESSION_LABEL, FORMULA, STUDENT_MODE, TERM} from "../../constants";
import FontAwesome from 'react-fontawesome';

const popoverHelpFormula = (
    <div className="collapse" id="help-formula">
       <div className="well">
          Tu je možné overiť, či ľubovoľná formula spĺňa vyššie definovanú štruktúru. Všetky termy a predikáty
          musia byť definované v jazyku. Ak formula nie je zapísaná v správnej syntaxi, nevyhodnotí sa. Je potrebné
          dodržiavať správne uzátvorkovanie podformúl. Napravo od
          formuly sa vyberá možnosť splnenia alebo nesplnenia formuly v štruktúre. Sú povolené nasledujúce symboly
          spojok, atómov a kvantifikátorov a žiadne iné:
          <ul>
             <li>Konjunkcia: \wedge, \land, &&, &, /\, ∧</li>
             <li>Disjunkcia: \vee, \lor, ||, |, \/, ∨</li>
             <li>Implikácia: \to, →, -></li>
             <li>Existenčný kvantifikátor: \exists, \e, \E, ∃</li>
             <li>Všeobecný kvantifikátor: \forall, \a, \A, ∀</li>
             <li>Negácia: \neg, \lnot, -, !, ~, ¬</li>
             <li>Rovnosť: =</li>
             <li>Nerovnosť: !=, &#60;&#62;, /=, &#8800;</li>
          </ul>
       </div>
    </div>
);

const popoverHelpTerm = (
    <div className="collapse" id="help-term">
       <div className="well">
          Tu sa pridávajú termy a je možné zistiť ich hodnotu na základe vyššie definovanej štruktúry. Všetky termy
          musia byť definované v jazyku. Každý symbol premennej, symbol konštanty a funkčný symbol sa považuje za term.
          Predikátový symbol nie je term. Povolené symboly spojok, atómov a kvantifikátorov sú rovnaké, ako pri formulách.
       </div>
    </div>
);

const getFormulaAnswers = () => (
    <React.Fragment>
       <option value={'-1'}>⊨/⊭?</option>
       <option value={'true'}>⊨</option>
       <option value={'false'}>⊭</option>
    </React.Fragment>
);

const getTermAnswers = (domain) => (
    <React.Fragment>
       <option value={''}>Vyber hodnotu ...</option>
       {domain.map(item =>
           <option value={item}>{item}</option>
       )}
    </React.Fragment>
);

function prepareExpressions(formulas, terms) {
   let f = {
      items: formulas,
      expressionType: FORMULA,
      answers: () => getFormulaAnswers(),
      help: popoverHelpFormula,
      panelTitle: 'Splnenie formúl v štruktúre 𝓜'
   };
   let t = {
      items: terms,
      expressionType: TERM,
      answers: (domain) => getTermAnswers(domain),
      help: popoverHelpTerm,
      panelTitle: 'Hodnoty termov v 𝓜'
   };
   return [f, t];
}

const Expressions = (props) => (
    <React.Fragment>
       {prepareExpressions(props.formulas, props.terms).map(expression =>
           <Panel>
              <Panel.Heading>
                 <Panel.Title>{expression.panelTitle}</Panel.Title>
                 <span data-toggle="collapse" data-target={"#help-" + expression.expressionType.toLowerCase()}
                       aria-expanded="false"
                       aria-controls="collapseExample">
                    ?
                 </span>
              </Panel.Heading>
              <Panel.Body>
                 {expression.help}
                 {expression.items.map((item, index) =>
                     <Row key={index}>
                        <Col sm={7}>
                           <FormGroup
                               validationState={item.feedback.message ? 'error' : null}>
                              <InputGroup>
                                 <label className='input-group-addon'
                                        htmlFor={expression.expressionType.toLowerCase() + '-' + index}>
                                    <span>{EXPRESSION_LABEL[expression.expressionType]}<sub>{index + 1}</sub></span></label>
                                 <FormControl type='text' value={item.value}
                                              onChange={(e) => props.onInputChange(e.target.value, index, expression.expressionType)}
                                              id={expression.expressionType.toLowerCase() + '-' + index}
                                              disabled={item.inputLocked}/>
                                 <InputGroup.Button>
                                    <Button
                                        onClick={() => props.removeExpression(expression.expressionType, index)}><FontAwesome
                                        name='trash'/></Button>
                                    {props.teacherMode ? (
                                        <div className='btn btn-lock'
                                             onClick={() => props.lockExpressionValue(expression.expressionType, index)}>
                                           <FontAwesome name={item.inputLocked ? 'unlock' : 'lock'}/>
                                        </div>
                                    ) : null}
                                 </InputGroup.Button>
                              </InputGroup>
                              <HelpBlock>{item.feedback.message}</HelpBlock>
                           </FormGroup>
                        </Col>
                        <Col sm={3}>
                           <FormGroup>
                              <InputGroup>
                                 <label className='input-group-addon'
                                        htmlFor={expression.expressionType.toLowerCase() + '-answer-' + index}>𝓜</label>
                                 <select className='form-control' value={item.answerValue}
                                         onChange={(e) => props.setExpressionAnswer(expression.expressionType, e.target.value, index)}
                                         id={expression.expressionType.toLowerCase() + '-answer-' + index}
                                         disabled={item.answerLocked}>
                                    {expression.answers(props.domain)}
                                 </select>
                                 {expression.expressionType === TERM ? null : (
                                     <span className='input-group-addon'>
                                       𝝋<sub>{index + 1}</sub>[e]
                                     </span>
                                 )}
                                 {props.teacherMode ? (
                                     <InputGroup.Button>
                                        <div className='btn btn-lock'
                                             onClick={() => props.lockExpressionAnswer(expression.expressionType, index)}>
                                           <FontAwesome
                                               name={item.answerLocked ? 'unlock' : 'lock'}/>
                                        </div>
                                     </InputGroup.Button>
                                 ) : null}
                              </InputGroup>
                           </FormGroup>
                        </Col>
                        <Col sm={2}>
                           {item.answerValue !== '' && item.answerValue !== '-1' ? (item.answerValue === item.expressionValue ?
                               <strong className="text-success"><FontAwesome
                                   name='check'/>&nbsp;Správne</strong> :
                               <strong className="text-danger"><FontAwesome
                                   name='times'/>&nbsp;Nesprávne</strong>) : null}
                        </Col>
                     </Row>
                 )}
                 <Button bsStyle='success' onClick={() => props.addExpression(expression.expressionType)}><FontAwesome
                     name='plus'/> Pridaj</Button>
              </Panel.Body>
           </Panel>
       )}
    </React.Fragment>
);

export default Expressions;