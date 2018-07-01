import React from 'react';
import { expect } from 'chai';
import { render, mount } from 'enzyme';

import IncomeForm from './incomeform.js';
import OutputMenu from './output.js'

describe('<IncomeForm />', () => {
  it('Contains Navbar', () => {
    const wrapper = mount(<IncomeForm />);
    //expect(wrapper.find('.Navbar')).to.have.length(1);
  });

  // it('Contains Desktop', () => {
  //   const wrapper = mount(<IncomeForm />);
  //   expect(wrapper.find('Desktop')).to.have.length(1);
  //   expect(wrapper.find('Desktop').find('div')).to.have.length(1);
  //   expect(wrapper.find('Desktop').contains(OutputMenu)).to.equal(true);
  // });
  //
  // it('Contains Mobile', () => {
  //   const wrapper = mount(<IncomeForm />);
  //   expect(wrapper.find('TabletMobile')).to.have.length(1);
  // });

});
