import React from 'react';
import { expect } from 'chai';
import { render, mount } from 'enzyme';

import IncomeForm from './incomeform.js';
import OutputMenu from './output.js'

describe('<IncomeForm />', () => {
  it('Contains header', () => {
    const wrapper = render(<IncomeForm />);
    expect(wrapper.find('h1')).to.have.length(1);
  });

  it('Contains Desktop', () => {
    const wrapper = mount(<IncomeForm />);
    expect(wrapper.find('Desktop')).to.have.length(1);
  });

  it('Contains Mobile', () => {
    const wrapper = mount(<IncomeForm />);
    expect(wrapper.find('TabletMobile')).to.have.length(1);
  });

});
