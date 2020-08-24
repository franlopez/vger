import React from 'react';
import { shallow } from 'enzyme';

import App, { breakpoint } from './index';
import Map from '../map';
import List from '../list';
import mockWikiPages from './mock-wiki-pages';

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
};

const mockGetCurrentPositionFailure = () => {
  getCurrentPosition.mockImplementation((success) => Promise.reject())
};

// set up jsonp call to wikipedia api
let mockJsonpError: any = null;
const mockJsonpSuccess = {
  query: {
    pages: mockWikiPages,
  }
};

jest.mock('jsonp', () => {
  return (url: any, config: any, callback: any) => {
    return callback(
      mockJsonpError,
      mockJsonpSuccess,
    );
  }
});

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

  describe('loading articles', () => {
    it('and sorts them alphabetically', () => {
      const wrapper = shallow(<App />);
      const sortedArticles = wrapper.find(Map).props().articles;
  
      expect(sortedArticles[0].title).toBe('Amazing, Frannnn!');
      expect(sortedArticles[1].title).toBe('Yes! Yes!');
      expect(sortedArticles[2].title).toBe('Zonalized Fransterdom');
    });

    it('does nothing for now when fetch fails', () => {
      mockJsonpError = 'someError';

      const wrapper = shallow(<App />);
  
      expect(wrapper.find(Map).props().articles.length).toBe(0);

      mockJsonpError = null;
    });
  });

  describe('with no user location', () => {
    beforeEach(() => {
      mockGetCurrentPositionFailure();
    });

    it('does not render map', () => {
      const wrapper = shallow(<App />);

      // if getArticles is called without userLocation set, it should silently fail
      (wrapper.instance() as App).getArticles();
  
      expect(wrapper.exists(Map)).toBe(false);
    });
  });

});