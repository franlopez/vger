import React from 'react';
import { shallow } from 'enzyme';

import Menu from './index';
import { ViewElement } from '../../types';

it('when map and list are visible, show switch no button', () => {
  const wrapper = shallow(<Menu showing={ViewElement.Both} updateShowing={() => null} />);

  expect(wrapper.contains('button')).toBe(false);
});

it('when map is visible, button switches to list', () => {
  const updateShowingSpy = jest.fn();

  const wrapper = shallow(<Menu showing={ViewElement.Map} updateShowing={updateShowingSpy} />);
  const button = wrapper.find('button').at(0);
  button.props().onClick({ preventDefault: () => null } as React.MouseEvent);

  expect(button.text()).toBe('List');
  expect(updateShowingSpy).toHaveBeenCalledWith(ViewElement.List);
});

it('when list is visible, button switches to map', () => {
  const updateShowingSpy = jest.fn();

  const wrapper = shallow(<Menu showing={ViewElement.List} updateShowing={updateShowingSpy} />);
  const button = wrapper.find('button').at(0);
  button.props().onClick({ preventDefault: () => null } as React.MouseEvent);

  expect(button.text()).toBe('Map');
  expect(updateShowingSpy).toHaveBeenCalledWith(ViewElement.Map);
});