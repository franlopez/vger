import React from 'react';
import { shallow } from 'enzyme';

import ArticlePreview from './index';
import mockWikiPages from '../app/mock-wiki-pages';

describe('ArticlePreview', () => {
  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<ArticlePreview article={mockWikiPages[1]} />);
    wrapper.unmount();
  });

  it('renders image and title', () => {
    const wrapper = shallow(<ArticlePreview article={mockWikiPages[1]} />);
        
    expect(wrapper.exists('h1')).toBe(true);
    expect(wrapper.exists('img')).toBe(true);
  });

  it('does not render image when thumbnail is not available', () => {
    const wrapper = shallow(<ArticlePreview article={mockWikiPages[0]} />);
        
    expect(wrapper.exists('h1')).toBe(true);
    expect(wrapper.exists('img')).toBe(false);
  });
});