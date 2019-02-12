  import React, { useState, Fragment } from 'react';

import CompareForm from './CompareForm';
import FlashMessage from './FlashMessage';
import FormSelector from './FormSelector';
import NotFoundPanel from './NotFoundPanel';
import StockForm from './StockForm';
import StockPanel from './StockPanel';
import { COMPARE_FORM, NOT_FOUND_PANEL, STOCK_FORM, STOCK_PANEL } from './constants';

const Main = () => {
  const [activeComponent, changeActiveComponent] = useState('Form-Selector');

  const active = componentName => {
    let component;
    switch (componentName) {      
      case COMPARE_FORM:
        component = <CompareForm changeActiveComponent={changeActiveComponent} />;
        break;
      case NOT_FOUND_PANEL:
        component = <NotFoundPanel changeActiveComponent={changeActiveComponent} />;
        break;
      case STOCK_FORM:
        component = <StockForm changeActiveComponent={changeActiveComponent} />;
        break;
      case STOCK_PANEL:
        component = <StockPanel changeActiveComponent={changeActiveComponent} />;
        break;
      default:
        component = <FormSelector changeActiveComponent={changeActiveComponent} />;
        break;
    }

    return component;
  }

  return (
    <Fragment>
      {active(activeComponent)}
    </Fragment>
  );
}

export default Main;