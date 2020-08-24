import React from 'react';
import { shallow } from 'enzyme';
import { Map as LeafletMap } from 'react-leaflet';

import Map from './index';
import mockWikiPages from '../app/mock-wiki-pages';

describe('Map', () => {
  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<Map userLocation={{ lat: 43.21, lng: 23.52 }} articles={[]} />);
    wrapper.unmount();
  });

  it('renders leaflet map with user location marker', () => {
    const wrapper = shallow(<Map userLocation={{ lat: 43.21, lng: 23.52 }} articles={[]} />);
        
    expect(wrapper.exists(LeafletMap)).toBe(true);
    expect(wrapper.find('.userMarker').length).toBe(1);
  });

  it('renders markers for articles when given', () => {
    const wrapper = shallow(<Map userLocation={{ lat: 43.21, lng: 23.52 }} articles={mockWikiPages} />);
    const articleMarkers = wrapper.find('.articleMarker');
    
    expect(articleMarkers.length).toBe(mockWikiPages.length);
  });
});