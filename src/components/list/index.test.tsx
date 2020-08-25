import React from 'react';
import { shallow } from 'enzyme';

import List from './index';
import ArticlePreview from '../article-preview';
import mockWikiPages from '../app/mock-wiki-pages';

describe('List', () => {
  it('mounts and unmounts without throwing errors', () => {
    const wrapper = shallow(<List articles={mockWikiPages} />);
    wrapper.unmount();
  });

  it('renders the ArticlePreviews', () => {
    const wrapper = shallow(<List articles={mockWikiPages} />);
        
    expect(wrapper.find(ArticlePreview).length).toBe(mockWikiPages.length);
  });
});