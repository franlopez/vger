import React from 'react';
import { shallow } from 'enzyme';

import Menu from './index';

describe('Menu', () => {
  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<Menu />);
    wrapper.unmount();
  });
});