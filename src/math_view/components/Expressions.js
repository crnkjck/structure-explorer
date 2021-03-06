import React from 'react';
import {
    Button,
    Form,
    InputGroup,
    Row,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {EXPRESSION_LABEL, FORMULA, TERM} from "../../constants";
import FontAwesome from 'react-fontawesome';
import LockButton from '../buttons/LockButton';
import HelpButton from "../buttons/HelpButton";

const helpFormula = (
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

const helpTerm = (
   <div className="collapse" id="help-term">
     <div className="well">
       Tu sa pridávajú termy a je možné zistiť ich hodnotu na základe vyššie definovanej štruktúry. Všetky termy
       musia byť definované v jazyku. Každý symbol premennej, symbol konštanty a funkčný symbol sa považuje za term.
       Predikátový symbol nie je term.
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
    help: helpFormula,
    panelTitle: 'Splnenie formúl v štruktúre 𝓜'
  };
  let t = {
    items: terms,
    expressionType: TERM,
    answers: (domain) => getTermAnswers(domain),
    help: helpTerm,
    panelTitle: 'Hodnoty termov v 𝓜'
  };
  return [f, t];
}

const Expressions = (props) => (
   <React.Fragment>
     {prepareExpressions(props.formulas, props.terms).map(expression =>
        <Card className={"no-border-radius"}>
          <Card.Header className={"d-flex justify-content-between"}>
            <Card.Title>{expression.panelTitle}</Card.Title>
              <HelpButton dataTarget={"#help-" + expression.expressionType.toLowerCase()}/>
          </Card.Header>
          <Card.Body>
            {expression.help}
            {expression.items.map((item, index) =>
               <Row key={index}>
                 <div className='expression'>
                   <div className='col-sm-6 col-md-8'>
                     <Form.Group>
                       <InputGroup>
                         <label className='input-group-addon'
                                htmlFor={expression.expressionType.toLowerCase() + '-' + index}>
                           <span>{EXPRESSION_LABEL[expression.expressionType]}<sub>{index + 1}</sub></span></label>
                           <Form.Control type='text' value={item.value}
                                         onChange={(e) => props.onInputChange(e.target.value, index, expression.expressionType)}
                                         id={expression.expressionType.toLowerCase() + '-' + index}
                                         disabled={item.inputLocked}/>
                           <InputGroup.Append>
                               <Button
                              onClick={() => props.removeExpression(expression.expressionType, index)}><FontAwesome
                              name='fas fa-trash'/></Button>
                           {props.teacherMode ? (
                              <LockButton
                                 lockFn={() => props.lockExpressionValue(expression.expressionType, index)}
                                 locked={item.inputLocked}/>
                           ) : null}
                           </InputGroup.Append>
                       </InputGroup>
                       <Form.Text className={item.errorMessage.length === 0?"":"alert alert-danger"}>{item.errorMessage}</Form.Text>
                     </Form.Group>
                   </div>
                   <div className='col-sm-4 col-md-2 col-xs-8 no-padding-right'>
                     <Form.Group>
                       <InputGroup>
                         <label className='input-group-addon'
                                htmlFor={expression.expressionType.toLowerCase() + '-answer-' + index}>𝓜</label>
                         <select className='form-control bootstrap-select' value={item.answerValue}
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
                            <InputGroup.Append>
                              <LockButton
                                 lockFn={() => props.lockExpressionAnswer(expression.expressionType, index)}
                                 locked={item.answerLocked}/>
                            </InputGroup.Append>
                         ) : null}
                       </InputGroup>
                     </Form.Group>
                   </div>
                   <div className='col-sm-2 col-md-2 col-xs-4 no-padding-left feedback'>
                     {item.answerValue !== '' && item.answerValue !== '-1' ? (item.answerValue === item.expressionValue ?
                        <strong className="text-success"><FontAwesome
                           name='check'/>&nbsp;Správne</strong> :
                        <strong className="text-danger"><FontAwesome
                           name='times'/>&nbsp;Nesprávne</strong>) : null}
                   </div>
                 </div>
               </Row>
            )}
              <Button variant={"success"} title={"Pridaj"} onClick={() => props.addExpression(expression.expressionType)}><FontAwesome
                  name='plus'/>
                  Pridaj
              </Button>
          </Card.Body>
        </Card>
     )}
   </React.Fragment>
);

export default Expressions;