import React from 'react'
import { mount, shallow } from 'enzyme'
import { Provider } from 'react-redux'

import createHistory from 'modules/app/createHistory'
import createReduxStore from 'modules/app/createReduxStore'

import ConnectedCategoriesPage, { CategoriesPage } from '../CategoriesPage'
import CategoryModel from 'modules/endpoint/models/CategoryModel'
import CategoriesMapModel from 'modules/endpoint/models/CategoriesMapModel'
import CityModel from '../../../../modules/endpoint/models/CityModel'

describe('CategoriesPage', () => {
  const categoryModels = [
    new CategoryModel({
      id: 0,
      url: '/augsburg/de',
      title: 'augsburg',
      content: '',
      parentId: -1,
      order: -1,
      availableLanguages: {},
      thumbnail: 'no_thumbnail',
      parentUrl: ''
    }), new CategoryModel({
      id: 3650,
      url: '/augsburg/de/anlaufstellen',
      title: 'Anlaufstellen zu sonstigen Themen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 75,
      availableLanguages: {
        en: 4361, ar: 4367, fa: 4368
      },
      thumbnail: 'https://cms.integreat-ap…/03/Hotline-150x150.png'
    }),
    new CategoryModel({
      id: 3649,
      url: '/augsburg/de/willkommen',
      title: 'Willkommen',
      content: '',
      parentId: 0,
      parentUrl: '/augsburg/de',
      order: 11,
      availableLanguages: {
        en: 4804, ar: 4819, fa: 4827
      },
      thumbnail: 'https://cms.integreat-ap…03/Beratung-150x150.png'
    }),
    new CategoryModel({
      id: 35,
      url: '/augsburg/de/willkommen/willkommen-in-augsburg',
      title: 'Willkommen in Augsburg',
      content: 'some content',
      parentId: 3649,
      parentUrl: '/augsburg/de/willkommen',
      order: 1,
      availableLanguages: {
        en: 390,
        de: 711,
        ar: 397
      },
      thumbnail: 'https://cms.integreat-ap…09/heart295-150x150.png'
    })
  ]

  const categories = new CategoriesMapModel(categoryModels)

  const cities = [
    new CityModel({name: 'Augsburg', code: 'augsburg'}),
    new CityModel({name: 'Stadt Regensburg', code: 'regensburg'}),
    new CityModel({name: 'Werne', code: 'werne'})
  ]

  const city = 'augsburg'

  const language = 'en'

  it('should match snapshot and render a Page if page has no children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      categoryPath={categoryModels[3].url} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot render a CategoryList if the category is neither the root nor has children', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      categoryPath={categoryModels[2].url} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render CategoryTiles if the path is the root category', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      categoryPath={'/augsburg/de'} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot and render an Error if path is not valid', () => {
    const wrapper = shallow(
      <CategoriesPage categories={categories}
                      cities={cities}
                      city={city}
                      language={language}
                      categoryPath={'/augsburg/de/not/valid'} />
    )

    expect(wrapper).toMatchSnapshot()
  })

  describe('connect', () => {
    const pathname = '/augsburg/de/willkommen'

    it('should map state to props', () => {
      const store = createReduxStore(createHistory, {
        location: {payload: {city: city, language: language, categoryPath: 'willkommen'},
          pathname: pathname
        },
        cities: {data: cities},
        categories: {data: categories}
      })

      const categoriesPage = mount(
        <Provider store={store}>
          <ConnectedCategoriesPage />
        </Provider>
      ).find(CategoriesPage)

      expect(categoriesPage.props()).toEqual({
        city: city,
        language: language,
        categoryPath: pathname,
        categories: categories,
        cities: cities
      })
    })
  })
})
