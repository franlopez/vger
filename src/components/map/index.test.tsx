import React from 'react';
import { shallow } from 'enzyme';
import { Map as LeafletMap } from 'react-leaflet';

import Map from './index';

describe('Map', () => {
  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<Map userLocation={{ lat: 43.21, lng: 23.52 }} />);
    wrapper.unmount();
  });

  it('renders leaflet map with user location marker', () => {
    const wrapper = shallow(<Map userLocation={{ lat: 43.21, lng: 23.52 }} />);
        
    expect(wrapper.exists(LeafletMap)).toBe(true);
    expect(wrapper.find('.userMarker').length).toBe(1);
  });
});