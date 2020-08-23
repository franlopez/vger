import React from 'react';
import { shallow } from 'enzyme';

import App, { breakpoint } from './index';
import Map from '../map';
import List from '../list';
import { ViewElement } from '../../types';

// set up global.navigator.geolocation mock
const getCurrentPosition = jest.fn();
Object.defineProperty(
  global.navigator,
  'geolocation',
  {
    value: { getCurrentPosition }
  }
);

const mockGetCurrentPositionSuccess = () => {
  getCurrentPosition.mockImplementation((success) =>
  Promise.resolve(
    success({
      coords: {
        latitude: 51.1,
        longitude: 45.3
      }
    })
 ));
}

describe('main app', () => {
  beforeEach(() => {
    getCurrentPosition.mockClear();
  });

  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<App />);
    wrapper.unmount();
  });

  describe('display of map and list according to viewport size when given geolocation', () => {
    beforeEach(() => {
      mockGetCurrentPositionSuccess();
    });

    describe('above breakpoint', () => {
      beforeEach(() => {
        global.innerWidth = breakpoint + 1;
      });
  
      it('renders both when started above breakpoint', () => {        
        const wrapper = shallow(<App />);
        
        expect(wrapper.exists(Map)).toBe(true);
        expect(wrapper.exists(List)).toBe(true);
      });
  
      it('renders map alone when resized below breakpoint', () => {
        const wrapper = shallow(<App />);
  
        // resize below breakpoint
        global.innerWidth = breakpoint - 1;
        global.dispatchEvent(new Event('resize'));
    
        expect(wrapper.exists(Map)).toBe(true);
        expect(wrapper.exists(List)).toBe(false);
      });
    });
  
    describe('below breakpoint', () => {
      beforeEach(() => {
        global.innerWidth = breakpoint - 1;
      });
  
      it('renders map alone when started below breakpoint', () => {
        const wrapper = shallow(<App />);
  
        expect(wrapper.exists(Map)).toBe(true);
        expect(wrapper.exists(List)).toBe(false);
      });
    
      it('can change to list when rendered below breakpoint', () => {
        const wrapper = shallow(<App />);
        const instance = wrapper.instance() as App;
    
        instance.updateShowing(ViewElement.List);
    
        expect(wrapper.exists(Map)).toBe(false);
        expect(wrapper.exists(List)).toBe(true);
      });
  
      it('renders both when resized above breakpoint', () => {
        const wrapper = shallow(<App />);
        // resize above breakpoint
        global.innerWidth = breakpoint + 1;
        global.dispatchEvent(new Event('resize'));

        expect(wrapper.exists(Map)).toBe(true);
        expect(wrapper.exists(List)).toBe(true);
      });
    });
  });
});